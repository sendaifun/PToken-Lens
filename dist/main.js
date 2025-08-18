import { appendTransactionMessageInstructions, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, generateKeyPairSigner, getBase64EncodedWireTransaction, getSignatureFromTransaction, pipe, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners, } from "@solana/kit";
import { readFileSync } from "fs";
// Import all our modular instructions
import { createTransferSolInstruction, createMintAccountInstruction, createInitializeMintInstruction, createAssociatedTokenAccountInstruction, createMintTokensInstruction, } from "./instructions/index.js";
import { findAssociatedTokenAccount } from "./utils/tokenUtils.js";
(async () => {
    // Configuration
    const receiver = "4wiSApzHMyA2z1pwhXsBXMhfABJdSwE38EWCzgjG5UnA";
    const RJ_TOKEN_PROGRAM_ADDRESS = "RJfyYQNDSTkv3PSpfM4wg7MudRmKFaYRMsPJSbiC5A1";
    const RPC_ENDPOINT = "https://api.devnet.solana.com";
    const WSS_ENDPOINT = "wss://api.devnet.solana.com";
    // Generate mint keypair
    const mint = await generateKeyPairSigner();
    // Load signer from keypair file
    const keypairBytes = JSON.parse(readFileSync("./keypair.json").toString());
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(keypairBytes));
    // Initialize RPC connections
    const rpc = createSolanaRpc(RPC_ENDPOINT);
    const rpcSubscriptions = createSolanaRpcSubscriptions(WSS_ENDPOINT);
    // 1. Create SOL transfer instruction
    const transferIX = createTransferSolInstruction({
        source: signer,
        destination: receiver,
        amount: 0.01
    });
    // 2. Find associated token account
    const ata = await findAssociatedTokenAccount({
        mint,
        owner: signer,
        tokenProgram: RJ_TOKEN_PROGRAM_ADDRESS
    });
    // 3. Create mint account instruction
    const createMintAccountIX = await createMintAccountInstruction({
        payer: signer,
        mint,
        programAddress: RJ_TOKEN_PROGRAM_ADDRESS,
        rpcEndpoint: RPC_ENDPOINT
    });
    // 4. Initialize mint instruction
    const createMintIX = createInitializeMintInstruction({
        mint,
        decimals: 9,
        mintAuthority: signer
    });
    // 5. Create associated token account instruction
    const createATAIX = createAssociatedTokenAccountInstruction({
        mint,
        ata,
        owner: signer,
        payer: signer,
        tokenProgram: RJ_TOKEN_PROGRAM_ADDRESS
    });
    // 6. Mint tokens instruction
    const mintTokensIX = createMintTokensInstruction({
        mint,
        mintAuthority: signer,
        amount: 1,
        decimals: 9,
        token: ata
    });
    // Build and send transaction
    const blockhash = (await rpc.getLatestBlockhash({ commitment: "finalized" }).send()).value;
    const transactionMessage = pipe(createTransactionMessage({ version: "legacy" }), (txm) => appendTransactionMessageInstructions([transferIX, createMintAccountIX, createMintIX, createATAIX, mintTokensIX], txm), (txm) => setTransactionMessageFeePayerSigner(signer, txm), (txm) => setTransactionMessageLifetimeUsingBlockhash(blockhash, txm));
    const signedTx = await signTransactionMessageWithSigners(transactionMessage);
    // Simulate transaction
    const simulation = await rpc
        .simulateTransaction(getBase64EncodedWireTransaction(signedTx), { encoding: "base64" })
        .send();
    console.log("Transaction simulation:", simulation);
    if (simulation.value.err) {
        console.error("Transaction simulation failed:", simulation.value.err);
        return;
    }
    // Send and confirm transaction
    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
    await sendAndConfirmTransaction(signedTx, { commitment: "confirmed" });
    const signature = getSignatureFromTransaction(signedTx);
    console.log("Transaction successful! Signature:", signature);
})();
//# sourceMappingURL=main.js.map
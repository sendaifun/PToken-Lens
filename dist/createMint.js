import { address, appendTransactionMessageInstructions, createKeyPairSignerFromBytes, createSolanaRpc, createSolanaRpcSubscriptions, createTransactionMessage, getBase64EncodedWireTransaction, getSignatureFromTransaction, lamports, generateKeyPairSigner, pipe, sendAndConfirmTransactionFactory, setTransactionMessageFeePayerSigner, setTransactionMessageLifetimeUsingBlockhash, signTransactionMessageWithSigners, } from "@solana/kit";
import { getTransferSolInstruction, getCreateAccountInstruction, SYSTEM_PROGRAM_ADDRESS, } from "@solana-program/system";
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS, getMintSize, getInitializeMint2Instruction, getCreateAssociatedTokenInstruction, getMintToCheckedInstruction, getBurnCheckedInstruction, } from "@solana-program/token";
import { readFileSync } from "fs";
(async () => {
    // Load signer
    const keypairBytes = JSON.parse(readFileSync("./keypair.json").toString());
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(keypairBytes));
    const RJ_TOKEN_PROGRAM_ADDRESS = address("RJfyYQNDSTkv3PSpfM4wg7MudRmKFaYRMsPJSbiC5A1");
    const rpc = createSolanaRpc("https://api.devnet.solana.com");
    const rpcSubscriptions = createSolanaRpcSubscriptions("wss://api.devnet.solana.com");
    // New mint
    const mint = await generateKeyPairSigner();
    // Derive signer ATA
    const [signerATA] = await findAssociatedTokenPda({
        mint: address(mint.address),
        owner: address(signer.address),
        tokenProgram: RJ_TOKEN_PROGRAM_ADDRESS,
    });
    // Rent-exempt balance for mint
    const requiredSpace = getMintSize();
    const requiredRent = await rpc.getMinimumBalanceForRentExemption(BigInt(requiredSpace)).send();
    // Create mint account
    const createMintAccountIX = getCreateAccountInstruction({
        payer: signer,
        newAccount: mint,
        space: requiredSpace,
        lamports: requiredRent,
        programAddress: RJ_TOKEN_PROGRAM_ADDRESS,
    });
    // Initialize mint
    const createMintIX = getInitializeMint2Instruction({
        mint: address(mint.address),
        decimals: 9,
        mintAuthority: address(signer.address),
    });
    // Create ATA for signer
    const createSignerATAIX = getCreateAssociatedTokenInstruction({
        mint: address(mint.address),
        ata: signerATA,
        owner: address(signer.address),
        payer: signer,
        systemProgram: SYSTEM_PROGRAM_ADDRESS,
        tokenProgram: RJ_TOKEN_PROGRAM_ADDRESS,
    });
    // Mint to signer
    const mintTokensIX = getMintToCheckedInstruction({
        mint: address(mint.address),
        mintAuthority: signer,
        amount: 1000n * 10n ** 9n, // 1000 tokens
        decimals: 9,
        token: signerATA,
    });
    // Burn from signer
    const burnTokensIX = getBurnCheckedInstruction({
        mint: address(mint.address),
        account: signerATA,
        authority: signer,
        amount: 50n * 10n ** 9n, // burn 50 tokens
        decimals: 9,
    });
    // (Optional) add a simple SOL transfer to self, just to consume CU
    const transferSOLIX = getTransferSolInstruction({
        source: signer,
        destination: address(signer.address), // sending to self
        amount: lamports(1000000n), // 0.001 SOL
    });
    // Get blockhash
    const blockhash = (await rpc.getLatestBlockhash({ commitment: "finalized" }).send()).value;
    // Build tx
    const txMessage = pipe(createTransactionMessage({ version: "legacy" }), (txm) => appendTransactionMessageInstructions([
        transferSOLIX, // optional, just CU noise
        createMintAccountIX,
        createMintIX,
        createSignerATAIX,
        mintTokensIX,
        burnTokensIX,
    ], txm), (txm) => setTransactionMessageFeePayerSigner(signer, txm), (txm) => setTransactionMessageLifetimeUsingBlockhash(blockhash, txm));
    const signedTx = await signTransactionMessageWithSigners(txMessage);
    // Simulate first (to get CU usage)
    const simulation = await rpc
        .simulateTransaction(getBase64EncodedWireTransaction(signedTx), { encoding: "base64" })
        .send();
    console.log("Simulation logs:", simulation.value.logs);
    console.log("Compute Units consumed:", simulation.value.unitsConsumed);
    if (simulation.value.err)
        return;
    // Send & confirm
    const sendAndConfirmTransaction = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
    await sendAndConfirmTransaction(signedTx, { commitment: "confirmed" });
    const sx = getSignatureFromTransaction(signedTx);
    console.log("Tx Sig:", sx);
})();
//# sourceMappingURL=createMint.js.map
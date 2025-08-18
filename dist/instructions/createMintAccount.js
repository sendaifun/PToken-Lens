import { address, createSolanaRpc } from "@solana/kit";
import { getCreateAccountInstruction } from "@solana-program/system";
import { getMintSize } from "@solana-program/token";
export async function createMintAccountInstruction(params) {
    const { payer, mint, programAddress, rpcEndpoint } = params;
    const rpc = createSolanaRpc(rpcEndpoint);
    const requiredSpace = getMintSize();
    const requiredRent = await rpc
        .getMinimumBalanceForRentExemption(BigInt(requiredSpace))
        .send();
    return getCreateAccountInstruction({
        payer,
        newAccount: mint,
        space: requiredSpace,
        lamports: requiredRent,
        programAddress: address(programAddress)
    });
}
//# sourceMappingURL=createMintAccount.js.map
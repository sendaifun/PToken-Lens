import { address } from "@solana/kit";
import { findAssociatedTokenPda } from "@solana-program/token";
export async function findAssociatedTokenAccount(params) {
    const { mint, owner, tokenProgram } = params;
    const [ata] = await findAssociatedTokenPda({
        mint: address(mint.address),
        owner: address(owner.address),
        tokenProgram: address(tokenProgram)
    });
    return ata;
}
//# sourceMappingURL=tokenUtils.js.map
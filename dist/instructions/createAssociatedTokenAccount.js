import { address } from "@solana/kit";
import { getCreateAssociatedTokenInstruction } from "@solana-program/token";
import { SYSTEM_PROGRAM_ADDRESS } from "@solana-program/system";
export function createAssociatedTokenAccountInstruction(params) {
    const { mint, ata, owner, payer, tokenProgram } = params;
    return getCreateAssociatedTokenInstruction({
        mint: address(mint.address),
        ata: address(ata),
        owner: address(owner.address),
        payer,
        systemProgram: SYSTEM_PROGRAM_ADDRESS,
        tokenProgram: address(tokenProgram)
    });
}
//# sourceMappingURL=createAssociatedTokenAccount.js.map
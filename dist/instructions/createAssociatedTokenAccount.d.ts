import type { TransactionSigner } from "@solana/kit";
export interface CreateAssociatedTokenAccountParams {
    mint: TransactionSigner;
    ata: string;
    owner: TransactionSigner;
    payer: TransactionSigner;
    tokenProgram: string;
}
export declare function createAssociatedTokenAccountInstruction(params: CreateAssociatedTokenAccountParams): import("@solana-program/token").CreateAssociatedTokenInstruction<import("@solana/kit").Address<"ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL">, string, string, import("@solana/kit").Address<string>, import("@solana/kit").Address<string>, "11111111111111111111111111111111", string, []>;
//# sourceMappingURL=createAssociatedTokenAccount.d.ts.map
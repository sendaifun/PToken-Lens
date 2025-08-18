import type { TransactionSigner } from "@solana/kit";
export interface FindAssociatedTokenAccountParams {
    mint: TransactionSigner;
    owner: TransactionSigner;
    tokenProgram: string;
}
export declare function findAssociatedTokenAccount(params: FindAssociatedTokenAccountParams): Promise<string>;
//# sourceMappingURL=tokenUtils.d.ts.map
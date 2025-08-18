import type { TransactionSigner } from "@solana/kit";
export interface MintTokensParams {
    mint: TransactionSigner;
    mintAuthority: TransactionSigner;
    amount: number;
    decimals: number;
    token: string;
}
export declare function createMintTokensInstruction(params: MintTokensParams): import("@solana-program/token").MintToCheckedInstruction<import("@solana/kit").Address<"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA">, import("@solana/kit").Address<string>, string, string, []>;
//# sourceMappingURL=mintTokens.d.ts.map
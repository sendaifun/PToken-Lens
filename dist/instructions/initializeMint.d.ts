import type { TransactionSigner } from "@solana/kit";
export interface InitializeMintParams {
    mint: TransactionSigner;
    decimals: number;
    mintAuthority: TransactionSigner;
}
export declare function createInitializeMintInstruction(params: InitializeMintParams): import("@solana-program/token").InitializeMint2Instruction<import("@solana/kit").Address<"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA">, import("@solana/kit").Address<string>, []>;
//# sourceMappingURL=initializeMint.d.ts.map
import type { TransactionSigner } from "@solana/kit";
export interface TransferSolParams {
    source: TransactionSigner;
    destination: string;
    amount: number;
}
export declare function createTransferSolInstruction(params: TransferSolParams): import("@solana-program/system").TransferSolInstruction<import("@solana/kit").Address<"11111111111111111111111111111111">, string, string, []>;
//# sourceMappingURL=transferSol.d.ts.map
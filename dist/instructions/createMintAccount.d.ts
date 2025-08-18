import type { TransactionSigner } from "@solana/kit";
export interface CreateMintAccountParams {
    payer: TransactionSigner;
    mint: TransactionSigner;
    programAddress: string;
    rpcEndpoint: string;
}
export declare function createMintAccountInstruction(params: CreateMintAccountParams): Promise<any>;
//# sourceMappingURL=createMintAccount.d.ts.map
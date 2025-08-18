import { address, lamports } from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";
export function createTransferSolInstruction(params) {
    const { source, destination, amount } = params;
    const lamportsAmount = BigInt(amount * 1_000_000_000);
    return getTransferSolInstruction({
        source,
        destination: address(destination),
        amount: lamports(lamportsAmount)
    });
}
//# sourceMappingURL=transferSol.js.map
import { address } from "@solana/kit";
import { getMintToCheckedInstruction } from "@solana-program/token";
export function createMintTokensInstruction(params) {
    const { mint, mintAuthority, amount, decimals, token } = params;
    return getMintToCheckedInstruction({
        mint: address(mint.address),
        mintAuthority,
        amount: BigInt(amount * Math.pow(10, decimals)),
        decimals,
        token: address(token)
    });
}
//# sourceMappingURL=mintTokens.js.map
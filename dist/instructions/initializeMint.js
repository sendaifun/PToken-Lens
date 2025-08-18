import { address } from "@solana/kit";
import { getInitializeMint2Instruction } from "@solana-program/token";
export function createInitializeMintInstruction(params) {
    const { mint, decimals, mintAuthority } = params;
    return getInitializeMint2Instruction({
        mint: address(mint.address),
        decimals,
        mintAuthority: address(mintAuthority.address)
    });
}
//# sourceMappingURL=initializeMint.js.map
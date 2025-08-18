import { PublicKey } from "@solana/web3.js"

// Official SPL Token Program ID
export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

// Transaction types with their compute unit costs
export const TRANSACTION_TYPES = {
  InitializeMint: { ptokenCU: 100, splTokenCU: 2967, supported: true },
  InitializeAccount: { ptokenCU: 185, splTokenCU: 4527, supported: true },
  InitializeMultisig: { ptokenCU: 204, splTokenCU: 2973, supported: true },
  Transfer: { ptokenCU: 155, splTokenCU: 4645, supported: true },
  Approve: { ptokenCU: 122, splTokenCU: 2904, supported: true },
  Revoke: { ptokenCU: 97, splTokenCU: 2677, supported: true },
  SetAuthority: { ptokenCU: 127, splTokenCU: 3167, supported: true },
  MintTo: { ptokenCU: 155, splTokenCU: 4538, supported: true },
  Burn: { ptokenCU: 168, splTokenCU: 4753, supported: true },
  CloseAccount: { ptokenCU: 154, splTokenCU: 2916, supported: true },
  FreezeAccount: { ptokenCU: 136, splTokenCU: 4265, supported: true },
  ThawAccount: { ptokenCU: 136, splTokenCU: 4267, supported: true },
  TransferChecked: { ptokenCU: 204, splTokenCU: 6201, supported: true },
  ApproveChecked: { ptokenCU: 162, splTokenCU: 4459, supported: true },
  MintToChecked: { ptokenCU: 164, splTokenCU: 4546, supported: true },
  BurnChecked: { ptokenCU: 169, splTokenCU: 4755, supported: true },
  InitializeAccount2: { ptokenCU: 164, splTokenCU: 4388, supported: true },
  SyncNative: { ptokenCU: 0, splTokenCU: 0, supported: true },
  InitializeAccount3: { ptokenCU: 272, splTokenCU: 4240, supported: true },
  InitializeMultisig2: { ptokenCU: 319, splTokenCU: 2826, supported: true },
  InitializeMint2: { ptokenCU: 234, splTokenCU: 2827, supported: true },
  GetAccountDataSize: { ptokenCU: 0, splTokenCU: 0, supported: true },
  InitializeImmutableOwner: { ptokenCU: 0, splTokenCU: 0, supported: true },
  AmountToUiAmount: { ptokenCU: 503, splTokenCU: 2501, supported: true },
  UiAmountToAmount: { ptokenCU: 875, splTokenCU: 3161, supported: true },
} as const

// Helius RPC configuration
export const HELIUS_CONFIG = {
  apiKey: "2919d1db-d1eb-46e2-939e-6314f988b459",
  devnet: "https://devnet.helius-rpc.com",
  mainnet: "https://mainnet.helius-rpc.com",
} as const

// Base fee for Solana transactions
export const BASE_FEE = 5000

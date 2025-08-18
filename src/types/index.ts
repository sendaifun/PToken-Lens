export interface TransactionType {
  ptokenCU: number
  splTokenCU: number
  supported: boolean
}

export interface AnalyzedTransaction {
  signature: string
  priorityFeePerCU: number
  totalCU: number
  totalPriorityFeeSol: number
  transactionType: string
  ptokenCU: number
  ptokenPriorityFeeSol: number
  solSavings: number
  percentageSavings: number
  instructionBreakdown?: Array<{name: string, splTokenCU: number, ptokenCU: number}>
}

export interface TransactionTypes {
  [key: string]: TransactionType
}

export type Mode = "calculator" | "analyzer"
export type Network = "devnet" | "mainnet-beta"

import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, TRANSACTION_TYPES, RPC_CONFIG, BASE_FEE } from "../constants/index"
import type { AnalyzedTransaction, Network } from "../types/index"

export class TransactionAnalyzer {
  private connection: Connection

  constructor(network: Network) {
    const rpcUrl = network === "devnet" 
      ? `${RPC_CONFIG.devnet}`
      : `${RPC_CONFIG.mainnet}`
    
    this.connection = new Connection(rpcUrl, "confirmed")
  }

  async analyzeTransaction(transactionId: string): Promise<AnalyzedTransaction> {
    const signature = transactionId.trim()
    const transaction = await this.connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    })

    if (!transaction) {
      throw new Error("Transaction not found. Please ensure the signature is correct and you have selected the right network.")
    }

    if (!transaction.meta) {
      throw new Error("Transaction metadata not available. This can happen with very old transactions.")
    }

    if (transaction.meta.err) {
      throw new Error("This transaction failed and cannot be analyzed for compute savings.")
    }

    if (!transaction.meta.computeUnitsConsumed) {
      throw new Error("Compute unit data is not available for this transaction.")
    }

    const totalCU = transaction.meta.computeUnitsConsumed
    const totalFee = transaction.meta.fee
    const priorityFee = Math.max(0, totalFee - BASE_FEE)
    const priorityFeePerCU = totalCU > 0 ? Math.floor((priorityFee / totalCU) * 1000000) : 0

    // Check if SPL Token program is involved
    const isSplTokenTx = this.isSplTokenTransaction(transaction)
    
    if (!isSplTokenTx) {
      throw new Error("This transaction doesn't contain SPL Token operations. P-Token savings only apply to SPL Token transactions.")
    }

    // Analyze the transaction
    const analysis = this.createAnalysis(
      signature,
      totalCU,
      priorityFee,
      priorityFeePerCU,
      transaction
    )

    return analysis
  }

  private isSplTokenTransaction(transaction: any): boolean {
    // Method 1: Check program logs for SPL Token operations (most reliable)
    const hasTokenLogs = transaction.meta.logMessages?.some((log: string) => 
      log.includes("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
    ) || false
    
    // Method 2: Check if SPL Token program is in loaded addresses
    const tokenProgramInLoadedAddresses = transaction.meta.loadedAddresses?.readonly?.some((key: any) => 
      key.equals(TOKEN_PROGRAM_ID)
    ) || transaction.meta.loadedAddresses?.writable?.some((key: any) => 
      key.equals(TOKEN_PROGRAM_ID)
    ) || false

    return hasTokenLogs || tokenProgramInLoadedAddresses
  }

  private createAnalysis(
    signature: string,
    totalCU: number,
    priorityFee: number,
    priorityFeePerCU: number,
    transaction: any
  ): AnalyzedTransaction {
    // Extract all SPL Token instructions from logs
    const splTokenInstructions = this.extractSplTokenInstructions(transaction)
    
    if (splTokenInstructions.length === 0) {
      // Fallback to generic SPL Token operation
      return this.createGenericAnalysis(
        signature,
        totalCU,
        priorityFee,
        priorityFeePerCU,
        "SPL Token Operation"
      )
    }

    // Calculate total SPL Token CU consumed
    const totalSplTokenCU = splTokenInstructions.reduce((sum, instruction) => {
      const instructionData = TRANSACTION_TYPES[instruction.name as keyof typeof TRANSACTION_TYPES]
      return sum + (instructionData?.splTokenCU || 0)
    }, 0)

    // Calculate total P-Token CU that would be consumed
    const totalPtokenCU = splTokenInstructions.reduce((sum, instruction) => {
      const instructionData = TRANSACTION_TYPES[instruction.name as keyof typeof TRANSACTION_TYPES]
      return sum + (instructionData?.ptokenCU || 0)
    }, 0)

    // Use the most common instruction type for display
    const mostCommonInstruction = this.getMostCommonInstruction(splTokenInstructions)
    
    return this.createDetailedAnalysis(
      signature,
      totalCU,
      totalSplTokenCU,
      totalPtokenCU,
      priorityFee,
      priorityFeePerCU,
      mostCommonInstruction,
      splTokenInstructions
    )
  }

  private extractSplTokenInstructions(transaction: any): Array<{name: string, cu: number}> {
    const instructions: Array<{name: string, cu: number}> = []

    const logs: string[] | undefined = transaction.meta?.logMessages
    if (!logs || logs.length === 0) return instructions

    const tokenProgram = TOKEN_PROGRAM_ID.toString()

    // Maintain a simple call stack of program IDs based on invoke/success/failed logs
    const programStack: string[] = []

    for (const log of logs) {
      // Push on invoke
      const invokeMatch = log.match(/^Program\s+([A-Za-z0-9]+)\s+invoke/)
      if (invokeMatch) {
        programStack.push(invokeMatch[1])
        continue
      }

      // If this is an instruction log, attribute it to the current top program
      const instrMatch = log.match(/^Program log: Instruction:\s*(\w+)/)
      if (instrMatch) {
        const currentProgram = programStack[programStack.length - 1]
        if (currentProgram === tokenProgram) {
          const name = instrMatch[1]
          if (TRANSACTION_TYPES[name as keyof typeof TRANSACTION_TYPES]) {
            // Count each instruction occurrence, not just unique types
            instructions.push({ name, cu: 0 })
          }
        }
        continue
      }

      // Pop on success/failed of the current top program
      const successMatch = log.match(/^Program\s+([A-Za-z0-9]+)\s+success/)
      if (successMatch) {
        // Only pop if it matches the current top to keep stack consistent
        if (programStack[programStack.length - 1] === successMatch[1]) {
          programStack.pop()
        }
        continue
      }

      const failedMatch = log.match(/^Program\s+([A-Za-z0-9]+)\s+failed/)
      if (failedMatch) {
        if (programStack[programStack.length - 1] === failedMatch[1]) {
          programStack.pop()
        }
        continue
      }
    }

    return instructions
  }

  private getMostCommonInstruction(instructions: Array<{name: string, cu: number}>): string {
    if (instructions.length === 0) return "SPL Token Operation"
    
    const counts: {[key: string]: number} = {}
    instructions.forEach(inst => {
      counts[inst.name] = (counts[inst.name] || 0) + 1
    })
    
    const mostCommon = Object.entries(counts).reduce((a, b) => 
      (counts[a[0]] || 0) > (counts[b[0]] || 0) ? a : b
    )
    
    return mostCommon?.[0] || "SPL Token Operation"
  }

  private createGenericAnalysis(
    signature: string,
    totalCU: number,
    priorityFee: number,
    priorityFeePerCU: number,
    transactionType: string
  ): AnalyzedTransaction {
    const totalPriorityFeeSol = priorityFee / LAMPORTS_PER_SOL
    const ptokenCU = TRANSACTION_TYPES.Transfer.ptokenCU
    const ptokenPriorityFeeSol = (ptokenCU * priorityFeePerCU) / 1000000 / LAMPORTS_PER_SOL
    const solSavings = totalPriorityFeeSol - ptokenPriorityFeeSol

    let percentageSavings: number
    if (totalPriorityFeeSol > 0) {
      percentageSavings = solSavings > 0 ? (solSavings / totalPriorityFeeSol) * 100 : 0
    } else {
      percentageSavings = totalCU > 0 ? ((totalCU - ptokenCU) / totalCU) * 100 : 0
    }

    return {
      signature: signature.slice(0, 8) + "..." + signature.slice(-8),
      priorityFeePerCU,
      totalCU,
      totalPriorityFeeSol,
      transactionType,
      ptokenCU,
      ptokenPriorityFeeSol,
      solSavings,
      percentageSavings,
    }
  }

  private createDetailedAnalysis(
    signature: string,
    totalCU: number,
    totalSplTokenCU: number,
    totalPtokenCU: number,
    priorityFee: number,
    priorityFeePerCU: number,
    transactionType: string,
    instructions: Array<{name: string, cu: number}>
  ): AnalyzedTransaction {
    const totalPriorityFeeSol = priorityFee / LAMPORTS_PER_SOL
    
    // Calculate P-Token priority fee based on actual P-Token CU
    const ptokenPriorityFeeSol = (totalPtokenCU * priorityFeePerCU) / 1000000 / LAMPORTS_PER_SOL
    const solSavings = totalPriorityFeeSol - ptokenPriorityFeeSol

    let percentageSavings: number
    if (totalPriorityFeeSol > 0) {
      percentageSavings = solSavings > 0 ? (solSavings / totalPriorityFeeSol) * 100 : 0
    } else {
      percentageSavings = totalSplTokenCU > 0 ? ((totalSplTokenCU - totalPtokenCU) / totalSplTokenCU) * 100 : 0
    }

    // Create instruction breakdown
    const instructionBreakdown = instructions.map(inst => {
      const instructionData = TRANSACTION_TYPES[inst.name as keyof typeof TRANSACTION_TYPES]
      return {
        name: inst.name,
        splTokenCU: instructionData?.splTokenCU || 0,
        ptokenCU: instructionData?.ptokenCU || 0
      }
    })

    return {
      signature: signature.slice(0, 8) + "..." + signature.slice(-8),
      priorityFeePerCU,
      totalCU,
      totalPriorityFeeSol,
      transactionType,
      ptokenCU: totalPtokenCU,
      ptokenPriorityFeeSol,
      solSavings,
      percentageSavings,
      instructionBreakdown,
    }
  }
}

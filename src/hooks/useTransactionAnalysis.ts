import { useState } from "react"
import { TransactionAnalyzer } from "../utils/transactionAnalyzer.js"
import type { AnalyzedTransaction, Network } from "../types/index.js"

export function useTransactionAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const [analyzedTransaction, setAnalyzedTransaction] = useState<AnalyzedTransaction | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalyzedTransaction[]>([])

  const analyzeTransaction = async (transactionId: string, network: Network) => {
    if (!transactionId.trim()) {
      setError("Please enter a transaction ID")
      return
    }

    setIsAnalyzing(true)
    setError("")
    setAnalyzedTransaction(null)

    try {
      const analyzer = new TransactionAnalyzer(network)
      const analysis = await analyzer.analyzeTransaction(transactionId)

      setAnalyzedTransaction(analysis)
      setAnalysisHistory((prev) => [analysis, ...prev.slice(0, 4)])
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "Failed to analyze transaction")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setAnalyzedTransaction(null)
    setError("")
  }

  return {
    isAnalyzing,
    error,
    analyzedTransaction,
    analysisHistory,
    analyzeTransaction,
    resetAnalysis,
  }
}

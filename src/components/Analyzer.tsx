import React, { useState } from "react"
import { Card } from "./ui/card.js"
import { Button } from "./ui/button.js"
import { Input } from "./ui/input.js"
import { useTransactionAnalysis } from "../hooks/useTransactionAnalysis.js"
import type { Network } from "../types/index.js"

interface AnalyzerProps {
  network: Network
  onNetworkChange: (network: Network) => void
}

export function Analyzer({ network, onNetworkChange }: AnalyzerProps) {
  const [transactionId, setTransactionId] = useState("")
  const {
    isAnalyzing,
    error,
    analyzedTransaction,
    analysisHistory,
    analyzeTransaction,
    resetAnalysis,
  } = useTransactionAnalysis()

  const handleTransactionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTransactionId(e.target.value || "")
  }

  const handleAnalyze = () => {
    analyzeTransaction(transactionId, network)
  }

  const handleNetworkChange = (newNetwork: Network) => {
    onNetworkChange(newNetwork)
    resetAnalysis()
  }

  return (
    <>
      {/* Network Selection */}
      <div className="text-center mb-8">
        <div className="bg-white rounded-lg p-1 border border-gray-200 shadow-sm inline-block">
          <Button
            variant={network === "devnet" ? "default" : "ghost"}
            onClick={() => handleNetworkChange("devnet")}
            className={network === "devnet" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}
          >
            Devnet
          </Button>
          <Button
            variant={network === "mainnet-beta" ? "default" : "ghost"}
            onClick={() => handleNetworkChange("mainnet-beta")}
            className={network === "mainnet-beta" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}
          >
            Mainnet
          </Button>
        </div>

      </div>

      {/* Transaction Input */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
                      <Input
              type="text"
              placeholder="Enter transaction signature"
              value={transactionId}
              onChange={handleTransactionIdChange}
              className="w-96 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
            />
                      <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !transactionId.trim()}
              className="px-6 py-3 text-lg font-semibold bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
        </div>

        {error && (
          <div className="text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 max-w-2xl mx-auto">
            {error}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analyzedTransaction && (
        <div className="space-y-6 mb-8">
          <Card className="p-6 bg-gray-900 text-white rounded-xl shadow-sm">
            <h3 className="text-2xl font-bold mb-4">Analysis Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100">Transaction Type</p>
                <p className="text-xl font-semibold">{analyzedTransaction.transactionType}</p>
              </div>
              <div>
                <p className="text-blue-100">Signature</p>
                <p className="text-sm font-mono">{analyzedTransaction.signature}</p>
              </div>
            </div>

          </Card>

          {/* Instruction Breakdown */}
          {analyzedTransaction.instructionBreakdown && analyzedTransaction.instructionBreakdown.length > 0 && (
            <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-4">SPL Token Instructions Detected</h4>
              <div className="space-y-3">
                {analyzedTransaction.instructionBreakdown.map((instruction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🔍</span>
                      <div>
                        <div className="font-semibold text-gray-800">{instruction.name}</div>
                        <div className="text-sm text-gray-500">
                          {instruction.splTokenCU} → {instruction.ptokenCU} CU
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {((instruction.splTokenCU - instruction.ptokenCU) / instruction.splTokenCU * 100).toFixed(1)}% reduction
                      </div>
                      <div className="text-xs text-gray-500">
                        {instruction.splTokenCU - instruction.ptokenCU} CU saved
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">SPL Token Operations</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Compute Units:</span>
                    <span className="font-semibold">{analyzedTransaction.totalCU.toLocaleString()} CU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority Fee:</span>
                    <span className="font-semibold">{analyzedTransaction.totalPriorityFeeSol.toFixed(6)} SOL</span>
                  </div>
                  {analyzedTransaction.instructionBreakdown && analyzedTransaction.instructionBreakdown.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        {analyzedTransaction.instructionBreakdown.length} SPL Token instructions
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">P-Token Equivalent</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compute Units:</span>
                    <span className="font-semibold text-gray-800">{analyzedTransaction.ptokenCU.toLocaleString()} CU</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority Fee:</span>
                    <span className="font-semibold text-gray-800">{analyzedTransaction.ptokenPriorityFeeSol.toFixed(6)} SOL</span>
                  </div>
                  {analyzedTransaction.instructionBreakdown && analyzedTransaction.instructionBreakdown.length > 1 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        Based on {analyzedTransaction.instructionBreakdown.length} SPL Token instructions
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <Card className="p-6 bg-gray-900 text-white rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold mb-3">Your Savings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-200">SOL Saved:</span>
                    <span className="font-semibold">{analyzedTransaction.solSavings.toFixed(6)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-200">Percentage:</span>
                    <span className="font-semibold">{analyzedTransaction.percentageSavings.toFixed(1)}%</span>
                  </div>
                </div>
              </Card>
            </div>
        </div>
      )}

      {/* Analysis History */}
      {analysisHistory.length > 0 && (
        <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Analysis History</h3>
          <div className="space-y-3">
            {analysisHistory.map((analysis, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-gray-600">{analysis.signature}</span>
                  <span className="text-sm text-gray-500">({analysis.transactionType})</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">
                    {analysis.solSavings.toFixed(6)} SOL saved
                  </div>
                  <div className="text-xs text-gray-500">
                    {analysis.percentageSavings.toFixed(1)}% reduction
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reset Button */}
      {analyzedTransaction && (
        <div className="text-center">
          <Button
            onClick={resetAnalysis}
            variant="outline"
            className="px-6 py-3 text-lg border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors"
          >
            Analyze Another Transaction
          </Button>
        </div>
      )}
    </>
  )
}

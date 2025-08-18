"use client"

import React, { useState } from "react"
import { Calculator } from "./components/Calculator.js"
import { Analyzer } from "./components/Analyzer.js"
import type { Mode, Network } from "./types/index.js"

export default function PTokenCalculator() {
  const [mode, setMode] = useState<Mode>("analyzer")
  const [network, setNetwork] = useState<Network>("devnet")

  const handleCalculate = (amount: number) => {
    // This would calculate actual savings based on the amount
    console.log(`Calculating savings for ${amount} tokens`)
  }

  const handleNetworkChange = (newNetwork: Network) => {
    setNetwork(newNetwork)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
                            <div className="text-center mb-12">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {mode === "calculator" ? "P-Token SOL Savings Calculator" : "P-Token Transaction Analyzer"}
                      </h1>
                      <p className="text-xl text-gray-600">
                        {mode === "calculator" 
                          ? "Calculate your SOL savings with P-Token's compute efficiency"
                          : "Analyze real Solana transactions and see P-Token's performance improvements"
                        }
                      </p>
                    </div>

        {/* Mode Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
            <button
              onClick={() => setMode("calculator")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                mode === "calculator"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              SOL Savings Calculator
            </button>
            <button
              onClick={() => setMode("analyzer")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                mode === "analyzer"
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Analyze Your Transaction
            </button>
          </div>
        </div>

        {/* Content based on mode */}
        {mode === "calculator" ? (
          <Calculator onCalculate={handleCalculate} />
        ) : (
          <Analyzer network={network} onNetworkChange={handleNetworkChange} />
        )}
      </div>
    </div>
  )
}
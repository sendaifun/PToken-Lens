import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Calculator } from './components/Calculator'
import { Analyzer } from './components/Analyzer'
import type { Mode, Network } from './types/index'
import './index.css'

function App() {
  const [mode, setMode] = useState<Mode>("analyzer")
  const [network, setNetwork] = useState<Network>("devnet")

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            {mode === "calculator" ? "P-Token SOL Savings Calculator" : "P-Token Transaction Analyzer"}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-2">
            {mode === "calculator" 
              ? "Calculate your SOL savings with P-Token's compute efficiency"
              : "Analyze real Solana transactions and see P-Token's performance improvements"
            }
          </p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-1 border border-gray-200 shadow-sm w-full max-w-md sm:w-auto">
            <div className="flex flex-col sm:flex-row">
              <button
                onClick={() => setMode("calculator")}
                className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                  mode === "calculator"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                SOL Savings Calculator
              </button>
              <button
                onClick={() => setMode("analyzer")}
                className={`px-4 sm:px-6 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                  mode === "analyzer"
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Analyze Your Transaction
              </button>
            </div>
          </div>
        </div>

        {/* Content based on mode */}
        {mode === "calculator" ? (
          <Calculator onCalculate={(amount) => console.log(`Calculating savings for ${amount} tokens`)} />
        ) : (
          <Analyzer network={network} onNetworkChange={setNetwork} />
        )}
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

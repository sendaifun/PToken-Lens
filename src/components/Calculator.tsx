import React, { useState } from "react"
import { TRANSACTION_TYPES } from "../constants/index.js"
import { Card } from "./ui/card.js"
import { Button } from "./ui/button.js"
import { Input } from "./ui/input.js"

interface CalculatorProps {
  onCalculate: (amount: number) => void
}

export function Calculator({ onCalculate }: CalculatorProps) {
  const [customAmount, setCustomAmount] = useState("")
  const [selectedAmount, setSelectedAmount] = useState(1000)

  const presetAmounts = [100, 1000, 10000, 100000, 1000000]

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount)
    onCalculate(amount)
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
  }

  const handleCustomCalculate = () => {
    const amount = parseFloat(customAmount)
    if (!isNaN(amount) && amount > 0) {
      onCalculate(amount)
    }
  }

  return (
    <>
      {/* Input Section */}
      <div className="text-center mb-12">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {presetAmounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              className={`px-6 py-3 text-lg font-semibold rounded-lg transition-colors ${selectedAmount === amount
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
            >
              {amount.toLocaleString()} txns
            </Button>
          ))}
        </div>

        <div className="flex justify-center items-center gap-4">
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="w-64 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
          />
          <Button
            onClick={handleCustomCalculate}
            className="px-6 py-3 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
          >
            Calculate
          </Button>
        </div>
      </div>

      {/* Savings Display */}
      <Card className="p-6 bg-gray-900 text-white text-center rounded-xl shadow-sm mb-8">
        <h3 className="text-2xl font-bold mb-2">
          {(selectedAmount * 0.000016561).toFixed(6)} SOL Saved
        </h3>
        <p className="text-lg text-gray-200">
          {((16.561 / 35.665) * 100).toFixed(1)}% compute reduction with P-Token
        </p>
        <p className="text-sm text-gray-300 mt-2">
          Based on {selectedAmount.toLocaleString()} SPL Token txns
        </p>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">SPL Token</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Compute Units:</span>
              <span className="font-semibold text-gray-800">{(selectedAmount * 35.665).toFixed(0)} CU</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">SOL Cost:</span>
              <span className="font-semibold text-gray-800">{(selectedAmount * 0.000035665).toFixed(6)} SOL</span>
            </div>
          </div>
        </Card>


        <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">P-Token</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Compute Units:</span>
              <span className="font-semibold text-gray-800">{(selectedAmount * 19.104).toFixed(0)} CU</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">SOL Cost:</span>
              <span className="font-semibold text-gray-800">{(selectedAmount * 0.000019104).toFixed(6)} SOL</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bar Graph Visualization */}
      <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Compute Units Comparison</h3>
        <div className="space-y-4">
          {/* SPL Token Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">SPL Token</span>
              <span className="text-gray-600 text-sm">{(selectedAmount * 35.665).toFixed(0)} CU</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-gray-900 h-8 rounded-full transition-all duration-500 ease-out"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          {/* P-Token Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium">P-Token</span>
              <span className="text-gray-600 text-sm">{(selectedAmount * 19.104).toFixed(0)} CU</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-8">
              <div
                className="bg-gray-600 h-8 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((selectedAmount * 19.104) / (selectedAmount * 35.665)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Visual representation of compute unit savings with P-Token
          </p>
        </div>
      </Card>

      {/* Token Lifecycle Explanation */}
      <Card className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">SPL Token Lifecycle (Core Instructions)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Token Creation</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• <strong>InitializeMint2</strong> - Create token mint (2,827 → 234 CU)</div>
              <div>• <strong>InitializeAccount3</strong> - Create token account (4,240 → 272 CU)</div>
              <div>• <strong>MintToChecked</strong> - Mint initial supply (4,546 → 164 CU)</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-3">Token Operations</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• <strong>TransferChecked</strong> - Send tokens (6,201 → 204 CU)</div>
              <div>• <strong>ApproveChecked</strong> - Delegate spending (4,459 → 162 CU)</div>
              <div>• <strong>BurnChecked</strong> - Destroy tokens (4,755 → 169 CU)</div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> This excludes ATA (Associated Token Account) and System program overhead,
            which remain the same for both SPL Token and P-Token implementations.
          </p>
        </div>
      </Card>
    </>
  )
}

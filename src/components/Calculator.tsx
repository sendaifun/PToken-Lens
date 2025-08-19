import React, { useState } from "react"
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
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {presetAmounts.map((amount) => (
            <Button
              key={amount}
              onClick={() => handlePresetClick(amount)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold rounded-lg transition-colors ${selectedAmount === amount
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                }`}
            >
              {amount.toLocaleString()} txns
            </Button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
          <Input
            type="number"
            placeholder="Enter custom amount"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className="w-full sm:w-64 px-3 sm:px-4 py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none"
          />
          <Button
            onClick={handleCustomCalculate}
            className="w-full sm:w-auto px-6 py-3 text-base sm:text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
          >
            Calculate
          </Button>
        </div>
      </div>

      {/* Savings Display */}
      <Card className="p-4 sm:p-6 bg-gray-900 text-white text-center rounded-xl shadow-sm mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">
          {(selectedAmount * 0.000016561).toFixed(6)} SOL Saved
        </h3>
        <p className="text-base sm:text-lg text-gray-200">
          {((16.561 / 35.665) * 100).toFixed(1)}% compute reduction with P-Token
        </p>
        <p className="text-sm text-gray-300 mt-2">
          Based on {selectedAmount.toLocaleString()} SPL Token txns
        </p>
      </Card>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">SPL Token</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Compute Units:</span>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{(selectedAmount * 35.665).toFixed(0)} CU</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">SOL Cost:</span>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{(selectedAmount * 0.000035665).toFixed(6)} SOL</span>
            </div>
          </div>
        </Card>


        <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">P-Token</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">Compute Units:</span>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{(selectedAmount * 19.104).toFixed(0)} CU</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base">SOL Cost:</span>
              <span className="font-semibold text-gray-800 text-sm sm:text-base">{(selectedAmount * 0.000019104).toFixed(6)} SOL</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bar Graph Visualization */}
      <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">Compute Units Comparison</h3>
        <div className="space-y-4">
          {/* SPL Token Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium text-sm sm:text-base">SPL Token</span>
              <span className="text-gray-600 text-xs sm:text-sm">{(selectedAmount * 35.665).toFixed(0)} CU</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8">
              <div
                className="bg-gray-900 h-6 sm:h-8 rounded-full transition-all duration-500 ease-out"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          {/* P-Token Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 font-medium text-sm sm:text-base">P-Token</span>
              <span className="text-gray-600 text-xs sm:text-sm">{(selectedAmount * 19.104).toFixed(0)} CU</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 sm:h-8">
              <div
                className="bg-gray-600 h-6 sm:h-8 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((selectedAmount * 19.104) / (selectedAmount * 35.665)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Visual representation of compute unit savings with P-Token
          </p>
        </div>
      </Card>

      {/* Token Lifecycle Flowchart */}
      <Card className="p-4 sm:p-6 bg-white border border-gray-200 rounded-xl shadow-sm mt-6 sm:mt-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">SPL Token Lifecycle (Core Instructions)</h3>
        
        {/* Flowchart Container */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 overflow-x-auto">
          <div className="min-w-full">
            {/* Token Creation Phase */}
            <div className="text-center mb-6">
              <div className="inline-block bg-gray-200 rounded-lg px-4 py-2 mb-4">
                <span className="font-semibold text-gray-800 text-sm sm:text-base">Token Creation</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-center min-w-0 flex-1 max-w-xs">
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">InitializeMint2</div>
                  <div className="text-xs text-gray-600">Create token mint</div>
                  <div className="text-xs text-green-600 font-medium">2,827 → 234 CU</div>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-center min-w-0 flex-1 max-w-xs">
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">InitializeAccount3</div>
                  <div className="text-xs text-gray-600">Create token account</div>
                  <div className="text-xs text-green-600 font-medium">4,240 → 272 CU</div>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-center min-w-0 flex-1 max-w-xs">
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">MintToChecked</div>
                  <div className="text-xs text-gray-600">Mint initial supply</div>
                  <div className="text-xs text-green-600 font-medium">4,546 → 164 CU</div>
                </div>
              </div>
            </div>

            {/* Arrow Down */}
            <div className="text-center mb-6">
              <div className="text-gray-400 text-2xl">↓</div>
            </div>

            {/* Token Operations Phase */}
            <div className="text-center">
              <div className="inline-block bg-gray-200 rounded-lg px-4 py-2 mb-4">
                <span className="font-semibold text-gray-800 text-sm sm:text-base">Token Operations</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-center min-w-0 flex-1 max-w-xs">
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">TransferChecked</div>
                  <div className="text-xs text-gray-600">Send tokens</div>
                  <div className="text-xs text-green-600 font-medium">6,201 → 204 CU</div>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-center min-w-0 flex-1 max-w-xs">
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">ApproveChecked</div>
                  <div className="text-xs text-gray-600">Delegate spending</div>
                  <div className="text-xs text-green-600 font-medium">4,459 → 162 CU</div>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-center min-w-0 flex-1 max-w-xs">
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">BurnChecked</div>
                  <div className="text-xs text-gray-600">Destroy tokens</div>
                  <div className="text-xs text-green-600 font-medium">4,755 → 169 CU</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600">
            <strong>Note:</strong> This excludes ATA (Associated Token Account) and System program overhead,
            which remain the same for both SPL Token and P-Token implementations.
          </p>
        </div>
      </Card>
    </>
  )
}

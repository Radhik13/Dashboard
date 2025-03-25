import React, { useState, useMemo } from 'react';
import { Calculator as CalcIcon, Search, AlertTriangle } from 'lucide-react';
import { useCurrencyPairs } from '../hooks/useCurrencyPairs';
import { Currency } from '../types/forex';

export function Calculator() {
  const allPairs = useCurrencyPairs();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPairSymbol, setSelectedPairSymbol] = useState<string | null>(null);
  const [accountBalance, setAccountBalance] = useState('10000');
  const [accountCurrency, setAccountCurrency] = useState<Currency>('USD');
  const [riskPercentage, setRiskPercentage] = useState('1');
  const [stopLossPips, setStopLossPips] = useState('50');
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="flex items-center gap-2">
          <CalcIcon className="w-6 h-6 text-tv-blue" />
          <h2 className="text-xl font-semibold text-tv-text-primary">Position Size Calculator</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Currency Pair Search */}
        <div className="relative">
          <label className="block text-sm font-medium text-tv-text-secondary mb-1">
            Currency Pair
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search (e.g., EUR/USD)"
              className="w-full p-2 pr-10 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary placeholder-tv-text-secondary focus:outline-none focus:border-tv-blue"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-tv-text-secondary" />
          </div>
          
          {showSuggestions && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-tv-bg-primary border border-tv-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {allPairs
                .filter(pair => 
                  pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  pair.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((pair) => (
                  <button
                    key={pair.symbol}
                    className="w-full px-4 py-2 text-left hover:bg-tv-bg-secondary focus:bg-tv-bg-secondary"
                    onClick={() => {
                      setSelectedPairSymbol(pair.symbol);
                      setSearchTerm(pair.symbol);
                      setShowSuggestions(false);
                    }}
                  >
                    <div className="font-medium text-tv-text-primary">{pair.symbol}</div>
                    <div className="text-sm text-tv-text-secondary">{pair.name}</div>
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-tv-text-secondary mb-1">
              Account Balance
            </label>
            <input
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-tv-text-secondary mb-1">
              Risk Percentage
            </label>
            <input
              type="number"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(e.target.value)}
              className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
              step="0.1"
            />
          </div>
        </div>

        {/* Stop Loss */}
        <div>
          <label className="block text-sm font-medium text-tv-text-secondary mb-1">
            Stop Loss (Pips)
          </label>
          <input
            type="number"
            value={stopLossPips}
            onChange={(e) => setStopLossPips(e.target.value)}
            className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
          />
        </div>

        {/* Results */}
        {selectedPairSymbol && (
          <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-tv-text-secondary">Position Size</div>
                <div className="text-2xl font-bold text-tv-text-primary">0.25 Lots</div>
              </div>
              <div>
                <div className="text-sm text-tv-text-secondary">Risk Amount</div>
                <div className="text-2xl font-bold text-tv-text-primary">$100.00</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
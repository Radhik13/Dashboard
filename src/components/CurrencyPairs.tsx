import React from 'react';
import { LineChart } from 'lucide-react';
import { useCurrencyPairs } from '../hooks/useCurrencyPairs';

export function CurrencyPairs() {
  const pairs = useCurrencyPairs();
  const categories = ['major', 'minor', 'exotic'] as const;

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="flex items-center gap-2">
          <LineChart className="w-6 h-6 text-tv-blue" />
          <h2 className="text-xl font-semibold text-tv-text-primary">Currency Pairs</h2>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {categories.map((category) => (
          <div key={category} className="space-y-3">
            <h3 className="text-lg font-medium capitalize text-tv-text-primary">{category} Pairs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pairs
                .filter((pair) => pair.category === category)
                .map((pair) => (
                  <div
                    key={pair.symbol}
                    className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-tv-text-primary">{pair.symbol}</h4>
                        <p className="text-sm text-tv-text-secondary">{pair.name}</p>
                        {pair.nickname && (
                          <p className="text-xs text-tv-blue mt-1">
                            {pair.nickname}
                          </p>
                        )}
                      </div>
                      {pair.bid && pair.ask && (
                        <div className="text-right">
                          <div className="text-sm text-tv-green">
                            {pair.bid.toFixed(4)}
                          </div>
                          <div className="text-sm text-tv-red">
                            {pair.ask.toFixed(4)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
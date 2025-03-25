import React, { useState } from 'react';
import { BookOpen, Plus, X, Trash2 } from 'lucide-react';
import { useTradeJournal } from '../hooks/useTradeJournal';

export function TradeJournal() {
  const { trades, addTrade, closeTrade, deleteTrade } = useTradeJournal();
  const [isAdding, setIsAdding] = useState(false);
  const [newTrade, setNewTrade] = useState({
    pair: 'EUR/USD',
    type: 'buy',
    entryPrice: 0,
    lotSize: 0.01,
  });

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-tv-blue" />
            <h2 className="text-xl font-semibold text-tv-text-primary">Trade Journal</h2>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-4 py-2 bg-tv-bg-primary text-tv-blue rounded-lg hover:bg-tv-border transition-colors"
          >
            {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAdding ? 'Cancel' : 'New Trade'}
          </button>
        </div>
      </div>

      <div className="p-4">
        {isAdding && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (newTrade.pair && newTrade.entryPrice && newTrade.lotSize) {
                addTrade({
                  ...newTrade,
                  id: Date.now().toString(),
                  openDate: new Date().toISOString(),
                  status: 'open',
                } as any);
                setIsAdding(false);
              }
            }}
            className="mb-6 p-4 bg-tv-bg-primary rounded-lg border border-tv-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Currency Pair
                </label>
                <input
                  type="text"
                  value={newTrade.pair}
                  onChange={(e) => setNewTrade({ ...newTrade, pair: e.target.value })}
                  className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Type
                </label>
                <select
                  value={newTrade.type}
                  onChange={(e) => setNewTrade({ ...newTrade, type: e.target.value as 'buy' | 'sell' })}
                  className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Entry Price
                </label>
                <input
                  type="number"
                  value={newTrade.entryPrice}
                  onChange={(e) => setNewTrade({ ...newTrade, entryPrice: parseFloat(e.target.value) })}
                  className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                  step="0.0001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Lot Size
                </label>
                <input
                  type="number"
                  value={newTrade.lotSize}
                  onChange={(e) => setNewTrade({ ...newTrade, lotSize: parseFloat(e.target.value) })}
                  className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                  step="0.01"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-tv-blue text-white rounded-lg hover:bg-opacity-90"
            >
              Add Trade
            </button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-tv-border">
                <th className="pb-2 text-tv-text-secondary">Pair</th>
                <th className="pb-2 text-tv-text-secondary">Type</th>
                <th className="pb-2 text-tv-text-secondary">Entry</th>
                <th className="pb-2 text-tv-text-secondary">Lot Size</th>
                <th className="pb-2 text-tv-text-secondary">Open Date</th>
                <th className="pb-2 text-tv-text-secondary">Status</th>
                <th className="pb-2 text-tv-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b border-tv-border last:border-0">
                  <td className="py-3 text-tv-text-primary">{trade.pair}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        trade.type === 'buy'
                          ? 'bg-tv-green bg-opacity-10 text-tv-green'
                          : 'bg-tv-red bg-opacity-10 text-tv-red'
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 text-tv-text-primary">{trade.entryPrice}</td>
                  <td className="py-3 text-tv-text-primary">{trade.lotSize}</td>
                  <td className="py-3 text-tv-text-primary">
                    {new Date(trade.openDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        trade.status === 'open'
                          ? 'bg-tv-blue bg-opacity-10 text-tv-blue'
                          : 'bg-tv-text-secondary bg-opacity-10 text-tv-text-secondary'
                      }`}
                    >
                      {trade.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {trade.status === 'open' && (
                        <button
                          onClick={() => closeTrade(trade.id)}
                          className="text-sm text-tv-blue hover:text-opacity-80"
                        >
                          Close
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this trade?')) {
                            deleteTrade(trade.id);
                          }
                        }}
                        className="text-sm text-tv-red hover:text-opacity-80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
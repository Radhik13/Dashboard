import React from 'react';
import { BarChart2, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { useTradeStats } from '../hooks/useTradeStats';

export function QuickStats() {
  const stats = useTradeStats();

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-tv-blue" />
          <h2 className="text-xl font-semibold text-tv-text-primary">Quick Stats</h2>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-tv-blue" />
              <h3 className="text-sm font-medium text-tv-text-secondary">Open Trades</h3>
            </div>
            <p className="text-2xl font-bold text-tv-text-primary mt-2">{stats.openTrades}</p>
          </div>
          
          <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-tv-green" />
              <h3 className="text-sm font-medium text-tv-text-secondary">Win Rate</h3>
            </div>
            <p className="text-2xl font-bold text-tv-green mt-2">{stats.winRate}%</p>
          </div>
          
          <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-tv-blue" />
              <h3 className="text-sm font-medium text-tv-text-secondary">Total Pips</h3>
            </div>
            <p className="text-2xl font-bold text-tv-text-primary mt-2">{stats.totalPips}</p>
          </div>
          
          <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-tv-blue" />
              <h3 className="text-sm font-medium text-tv-text-secondary">Total P/L</h3>
            </div>
            <p className={`text-2xl font-bold mt-2 ${stats.totalProfit >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
              ${stats.totalProfit.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
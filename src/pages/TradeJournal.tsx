import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  BookOpen, Filter, Plus, Calendar, Search, Star,
  TrendingUp, TrendingDown, Clock, AlertCircle, Brain,
  FileText, BarChart2, Download, Upload, Trash2, Edit2
} from 'lucide-react';
import { StickyHeader } from '../components/StickyHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TradeEntry, TradeSetup, TradeStatus, EmotionalState } from '../types/journal';

const defaultTrade: Partial<TradeEntry> = {
  symbol: '',
  direction: 'long',
  status: 'open',
  entryPrice: 0,
  stopLoss: 0,
  takeProfit: 0,
  size: 0.01,
  commission: 0,
  slippage: 0,
  strategy: '',
  setup: 'trend-following',
  timeframe: '1h',
  emotionalState: 'neutral',
  preTradeNotes: '',
  postTradeNotes: '',
  screenshots: [],
  tags: [],
  rating: 0,
  mistakes: [],
  lessons: [],
  entryTime: new Date().toISOString()
};

export function TradeJournal() {
  const [trades, setTrades] = useState<TradeEntry[]>(() => {
    const saved = localStorage.getItem('trades');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState<TradeEntry | null>(null);
  const [newTrade, setNewTrade] = useState<Partial<TradeEntry>>(defaultTrade);
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteSymbols, setFavoriteSymbols] = useState<string[]>([]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const closedTrades = trades.filter(t => t.status === 'closed');
    const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
    
    return {
      winRate: closedTrades.length > 0 
        ? (winningTrades.length / closedTrades.length) * 100 
        : 0,
      totalPnl: closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0),
      profitFactor: 2.5,
      averageRR: 1.5
    };
  }, [trades]);

  const handleAddTrade = () => {
    if (!newTrade.symbol || !newTrade.entryPrice) return;

    const trade: TradeEntry = {
      id: Date.now().toString(),
      ...defaultTrade,
      ...newTrade,
      entryTime: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as TradeEntry;

    setTrades(prev => [...prev, trade]);
    localStorage.setItem('trades', JSON.stringify([...trades, trade]));
    setShowAddForm(false);
    setNewTrade(defaultTrade);
  };

  const handleDeleteTrade = (tradeId: string) => {
    setTrades(prev => prev.filter(t => t.id !== tradeId));
    localStorage.setItem('trades', JSON.stringify(trades.filter(t => t.id !== tradeId)));
  };

  const toggleFavoriteSymbol = (symbol: string) => {
    setFavoriteSymbols(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy HH:mm');
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="min-h-screen bg-tv-bg-primary">
      <StickyHeader title="Trade Journal">
        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
              New Trade
            </button>
            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-tv-bg-secondary text-tv-text-secondary rounded-lg hover:text-tv-text-primary border border-tv-border"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-tv-bg-secondary text-tv-text-secondary rounded-lg hover:text-tv-text-primary border border-tv-border"
              >
                <Upload className="w-5 h-5" />
                Import
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-tv-text-secondary" />
              <input
                type="text"
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
              />
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-tv-bg-secondary text-tv-text-secondary rounded-lg hover:text-tv-text-primary border border-tv-border"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </StickyHeader>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border">
            <div className="flex items-center justify-between">
              <h3 className="text-tv-text-secondary text-sm">Win Rate</h3>
              <TrendingUp className="w-5 h-5 text-tv-green" />
            </div>
            <p className="text-2xl font-bold text-tv-text-primary mt-2">
              {stats.winRate.toFixed(2)}%
            </p>
          </div>
          <div className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border">
            <div className="flex items-center justify-between">
              <h3 className="text-tv-text-secondary text-sm">Total P/L</h3>
              <BarChart2 className="w-5 h-5 text-tv-blue" />
            </div>
            <p className={`text-2xl font-bold mt-2 ${
              stats.totalPnl >= 0 ? 'text-tv-green' : 'text-tv-red'
            }`}>
              ${stats.totalPnl.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border">
            <div className="flex items-center justify-between">
              <h3 className="text-tv-text-secondary text-sm">Profit Factor</h3>
              <TrendingUp className="w-5 h-5 text-tv-green" />
            </div>
            <p className="text-2xl font-bold text-tv-text-primary mt-2">
              {stats.profitFactor.toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border">
            <div className="flex items-center justify-between">
              <h3 className="text-tv-text-secondary text-sm">Avg R:R</h3>
              <TrendingUp className="w-5 h-5 text-tv-blue" />
            </div>
            <p className="text-2xl font-bold text-tv-text-primary mt-2">
              {stats.averageRR.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Trade List */}
        <div className="bg-tv-bg-secondary rounded-lg border border-tv-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-tv-border">
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">Symbol</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">Setup</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">Direction</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">Entry</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">Exit</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">P/L</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-tv-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trades.map(trade => (
                  <tr key={trade.id} className="border-b border-tv-border">
                    <td className="px-4 py-3 text-sm text-tv-text-primary">
                      {formatDate(trade.entryTime)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavoriteSymbol(trade.symbol)}
                          className={`text-sm ${
                            favoriteSymbols.includes(trade.symbol)
                              ? 'text-yellow-400'
                              : 'text-tv-text-secondary hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <span className="text-tv-text-primary">{trade.symbol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-tv-text-primary capitalize">
                        {trade.setup}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trade.direction === 'long'
                          ? 'bg-tv-green bg-opacity-10 text-tv-green'
                          : 'bg-tv-red bg-opacity-10 text-tv-red'
                      }`}>
                        {trade.direction.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-tv-text-primary">
                      ${trade.entryPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-tv-text-primary">
                      ${trade.exitPrice?.toFixed(2) || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${
                        (trade.pnl || 0) >= 0 ? 'text-tv-green' : 'text-tv-red'
                      }`}>
                        ${(trade.pnl || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTrade(trade)}
                          className="p-1 text-tv-text-secondary hover:text-tv-blue rounded"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTrade(trade);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-1 text-tv-text-secondary hover:text-tv-red rounded"
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
      </main>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Are you sure you want to delete this trade?"
        onConfirm={() => {
          if (selectedTrade) {
            handleDeleteTrade(selectedTrade.id);
          }
          setShowDeleteConfirm(false);
          setSelectedTrade(null);
        }}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedTrade(null);
        }}
      />
    </div>
  );
}
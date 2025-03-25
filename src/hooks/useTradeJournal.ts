import { useState, useEffect, useMemo } from 'react';
import { TradeEntry, TradeStats, JournalFilters } from '../types/journal';

const calculateStats = (trades: TradeEntry[]): TradeStats => {
  const closedTrades = trades.filter(t => t.status === 'closed');
  const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);

  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
  const totalPnlPercent = closedTrades.reduce((sum, t) => sum + (t.pnlPercent || 0), 0);

  const avgWin = winningTrades.length > 0
    ? winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0) / winningTrades.length
    : 0;

  const avgLoss = losingTrades.length > 0
    ? Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0)) / losingTrades.length
    : 0;

  return {
    totalTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
    averageWin: avgWin,
    averageLoss: avgLoss,
    largestWin: Math.max(...winningTrades.map(t => t.pnl || 0), 0),
    largestLoss: Math.min(...losingTrades.map(t => t.pnl || 0), 0),
    profitFactor: avgLoss > 0 ? avgWin / avgLoss : 0,
    totalPnl,
    totalPnlPercent,
    averageRR: avgLoss > 0 ? avgWin / avgLoss : 0,
    sharpeRatio: 0, // Requires more complex calculation
    maxDrawdown: 0, // Requires more complex calculation
  };
};

export function useTradeJournal() {
  const [trades, setTrades] = useState<TradeEntry[]>(() => {
    const saved = localStorage.getItem('tradeJournal');
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState<JournalFilters>({
    dateRange: [null, null],
    symbols: [],
    setups: [],
    status: [],
    pnlRange: [null, null],
    emotionalStates: [],
    tags: []
  });

  useEffect(() => {
    localStorage.setItem('tradeJournal', JSON.stringify(trades));
  }, [trades]);

  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (filters.dateRange[0] && new Date(trade.entryTime) < filters.dateRange[0]) return false;
      if (filters.dateRange[1] && new Date(trade.entryTime) > filters.dateRange[1]) return false;
      if (filters.symbols.length && !filters.symbols.includes(trade.symbol)) return false;
      if (filters.setups.length && !filters.setups.includes(trade.setup)) return false;
      if (filters.status.length && !filters.status.includes(trade.status)) return false;
      if (filters.emotionalStates.length && !filters.emotionalStates.includes(trade.emotionalState)) return false;
      if (filters.tags.length && !filters.tags.some(tag => trade.tags.includes(tag))) return false;
      if (filters.pnlRange[0] !== null && (trade.pnl || 0) < filters.pnlRange[0]) return false;
      if (filters.pnlRange[1] !== null && (trade.pnl || 0) > filters.pnlRange[1]) return false;
      return true;
    });
  }, [trades, filters]);

  const stats = useMemo(() => calculateStats(filteredTrades), [filteredTrades]);

  const addTrade = (trade: Omit<TradeEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTrade: TradeEntry = {
      ...trade,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTrades(prev => [...prev, newTrade]);
  };

  const updateTrade = (id: string, updates: Partial<TradeEntry>) => {
    setTrades(prev => prev.map(trade =>
      trade.id === id
        ? { ...trade, ...updates, updatedAt: new Date().toISOString() }
        : trade
    ));
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
  };

  const updateFilters = (newFilters: Partial<JournalFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    trades: filteredTrades,
    stats,
    filters,
    addTrade,
    updateTrade,
    deleteTrade,
    updateFilters
  };
}
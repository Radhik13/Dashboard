import { useTradeJournal } from './useTradeJournal';

export function useTradeStats() {
  const { trades } = useTradeJournal();

  const openTrades = trades.filter((trade) => trade.status === 'open').length;
  const closedTrades = trades.filter((trade) => trade.status === 'closed');
  const winningTrades = closedTrades.filter((trade) => (trade.profit || 0) > 0).length;
  const winRate = closedTrades.length > 0
    ? Math.round((winningTrades / closedTrades.length) * 100)
    : 0;
  const totalProfit = closedTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const totalPips = Math.round(Math.abs(totalProfit) / 10); // Simplified pip calculation

  return {
    openTrades,
    winRate,
    totalPips,
    totalProfit,
  };
}
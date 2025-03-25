export type TradeDirection = 'long' | 'short';
export type TradeStatus = 'open' | 'closed' | 'cancelled';
export type EmotionalState = 'confident' | 'neutral' | 'anxious' | 'fomo' | 'frustrated' | 'calm';
export type TradeSetup = 'trend-following' | 'reversal' | 'breakout' | 'range' | 'scalp' | 'swing' | 'position';

export interface TradeEntry {
  id: string;
  symbol: string;
  direction: TradeDirection;
  status: TradeStatus;
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  takeProfit: number;
  size: number;
  pnl?: number;
  pnlPercent?: number;
  commission: number;
  slippage: number;
  strategy: string;
  setup: TradeSetup;
  timeframe: string;
  entryTime: string;
  exitTime?: string;
  emotionalState: EmotionalState;
  preTradeNotes: string;
  postTradeNotes: string;
  screenshots: string[];
  tags: string[];
  rating: number;
  mistakes: string[];
  lessons: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  totalPnl: number;
  totalPnlPercent: number;
  averageRR: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

export interface JournalFilters {
  dateRange: [Date | null, Date | null];
  symbols: string[];
  setups: TradeSetup[];
  status: TradeStatus[];
  pnlRange: [number | null, number | null];
  emotionalStates: EmotionalState[];
  tags: string[];
}
export interface Strategy {
  id: string;
  name: string;
  description: string;
  entryRules: string[];
  exitRules: string[];
  timeframes: string[];
  pairs: string[];
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalTrades: number;
  };
  backtest: {
    startDate: string;
    endDate: string;
    results: BacktestResult[];
  };
}

export interface BacktestResult {
  id: string;
  date: string;
  pair: string;
  type: 'buy' | 'sell';
  entry: number;
  exit: number;
  stopLoss: number;
  takeProfit: number;
  profit: number;
  riskRewardRatio: number;
  duration: number;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  conditions: string[];
  successRate: number;
  occurrences: number;
  averageReturn: number;
}

export interface MarketCondition {
  id: string;
  timestamp: string;
  type: 'trend' | 'range' | 'breakout';
  strength: number;
  indicators: {
    name: string;
    value: number;
    signal: 'buy' | 'sell' | 'neutral';
  }[];
}
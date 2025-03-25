export interface Strategy {
  id: string;
  name: string;
  timeframe: string;
  tradesCount: number;
  winRate: number;
  profitFactor: number;
  riskRewardRatio: number;
  strengths: string[];
  weaknesses: string[];
  notes: string;
  status: 'idea' | 'testing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface StrategyIdea {
  id: string;
  name: string;
  concept: string;
  hypothesis: string;
  createdAt: string;
}

export type TimeFrame = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';
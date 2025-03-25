import { Trade } from './forex';

export interface RiskMetrics {
  winLossRatio: number;
  maxDrawdown: number;
  riskPerTrade: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  profitFactor: number;
  sharpeRatio: number;
}

export interface RiskSettings {
  maxRiskPerTrade: number;
  maxDrawdownLimit: number;
  minRiskRewardRatio: number;
  defaultStopLoss: number;
  defaultTakeProfit: number;
}

export interface TradeAlert {
  id: string;
  type: 'risk' | 'drawdown' | 'overtrading';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface TradingSession {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  trades: Trade[];
  performance: {
    winRate: number;
    profitLoss: number;
    averageWin: number;
    averageLoss: number;
  };
}

export interface PerformanceMetrics {
  byPair: Record<string, {
    trades: number;
    winRate: number;
    profitLoss: number;
    averageRR: number;
  }>;
  bySession: Record<string, {
    trades: number;
    winRate: number;
    profitLoss: number;
    bestPairs: string[];
  }>;
  byTimeOfDay: Record<string, {
    trades: number;
    winRate: number;
    profitLoss: number;
  }>;
}
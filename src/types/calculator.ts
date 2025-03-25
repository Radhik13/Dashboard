export type MarketType = 'forex' | 'stocks' | 'crypto' | 'futures' | 'options';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF' | 'AUD' | 'CAD' | 'NZD';
export type UnitType = 'pips' | 'points' | 'dollars' | 'percent';

export interface Instrument {
  symbol: string;
  name: string;
  type: MarketType;
  minSize: number;
  maxSize: number;
  pipValue?: number;
  contractSize?: number;
  tickSize?: number;
  multiplier?: number;
}

export interface CalculatorState {
  marketType: MarketType;
  accountCurrency: Currency;
  accountBalance: number;
  customBalance: number | null;
  riskPercentage: number;
  stopLoss: number;
  stopLossUnit: UnitType;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitLevels: {
    price: number;
    percentage: number;
  }[];
  leverage: number;
  instrument: string;
  commission: number;
  spread: number;
  slippage: number;
}

export interface PositionSizeResult {
  size: number;
  riskAmount: number;
  pipValue?: number;
  margin: number;
  potentialProfit: number;
  riskRewardRatio: number;
  commission: number;
  totalCost: number;
}

export interface Template {
  id: string;
  name: string;
  marketType: MarketType;
  settings: Partial<CalculatorState>;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}
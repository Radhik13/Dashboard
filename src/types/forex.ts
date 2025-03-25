export interface CurrencyPair {
  symbol: string;
  name: string;
  category: 'major' | 'minor' | 'exotic';
  nickname?: string;
  bid?: number;
  ask?: number;
}

export interface MarketSession {
  name: string;
  status: 'open' | 'closed';
  openTime: string;
  closeTime: string;
  nextOpenIn?: string;
  nextCloseIn?: string;
}

export interface TradeCalculation {
  pipValue: number;
  lotSize: number;
  potentialProfit: number;
  potentialLoss: number;
}

export interface Trade {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  lotSize: number;
  stopLoss?: number;
  takeProfit?: number;
  openDate: string;
  closeDate?: string;
  profit?: number;
  status: 'open' | 'closed';
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF' | 'AUD' | 'CAD' | 'NZD';
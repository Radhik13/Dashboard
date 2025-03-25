export type MarketSession = 'asia' | 'europe' | 'us' | 'crypto' | 'commodities';

export interface MarketSessionInfo {
  id: MarketSession;
  name: string;
  description: string;
  timezone: string;
  openTime: string; // 24h format
  closeTime: string;
  status: 'open' | 'closed' | 'pre-market' | 'after-hours';
  mainIndices: string[];
  keyPairs: string[];
}

export interface MarketStats {
  volume: number;
  volatility: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  performance: number;
}

export interface UserPreferences {
  defaultSession: MarketSession;
  favoriteMarkets: MarketSession[];
  watchlists: {
    id: string;
    name: string;
    instruments: string[];
  }[];
  quickStats: {
    enabled: string[];
    order: string[];
  };
  theme: 'light' | 'dark' | 'system';
  chartLayout: {
    timeframe: string;
    indicators: string[];
    style: 'candles' | 'bars' | 'line';
  };
}

export interface MarketAlert {
  id: string;
  market: MarketSession;
  type: 'session-open' | 'session-close' | 'high-volatility' | 'custom';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}
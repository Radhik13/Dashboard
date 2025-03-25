import { useState, useEffect } from 'react';
import { Instrument, MarketType } from '../types/calculator';

const defaultInstruments: Record<MarketType, Instrument[]> = {
  forex: [
    { symbol: 'EUR/USD', name: 'Euro/US Dollar', type: 'forex', minSize: 0.01, maxSize: 100, pipValue: 10 },
    { symbol: 'GBP/USD', name: 'British Pound/US Dollar', type: 'forex', minSize: 0.01, maxSize: 100, pipValue: 10 },
    { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', type: 'forex', minSize: 0.01, maxSize: 100, pipValue: 9.30 },
  ],
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stocks', minSize: 1, maxSize: 100000 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'stocks', minSize: 1, maxSize: 100000 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stocks', minSize: 1, maxSize: 100000 },
  ],
  crypto: [
    { symbol: 'BTC/USD', name: 'Bitcoin/US Dollar', type: 'crypto', minSize: 0.001, maxSize: 100 },
    { symbol: 'ETH/USD', name: 'Ethereum/US Dollar', type: 'crypto', minSize: 0.01, maxSize: 1000 },
  ],
  futures: [
    { symbol: 'ES', name: 'E-mini S&P 500', type: 'futures', minSize: 1, maxSize: 100, contractSize: 50 },
    { symbol: 'NQ', name: 'E-mini NASDAQ 100', type: 'futures', minSize: 1, maxSize: 100, contractSize: 20 },
  ],
  options: [
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'options', minSize: 1, maxSize: 1000, multiplier: 100 },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'options', minSize: 1, maxSize: 1000, multiplier: 100 },
  ],
};

export function useInstruments(marketType: MarketType) {
  const [instruments, setInstruments] = useState<Instrument[]>(defaultInstruments[marketType]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInstruments(defaultInstruments[marketType]);
  }, [marketType]);

  const searchInstruments = (query: string): Instrument[] => {
    const searchTerm = query.toLowerCase();
    return instruments.filter(
      instrument => 
        instrument.symbol.toLowerCase().includes(searchTerm) ||
        instrument.name.toLowerCase().includes(searchTerm)
    );
  };

  const validateInstrument = (symbol: string): boolean => {
    return instruments.some(instrument => instrument.symbol === symbol);
  };

  const getInstrument = (symbol: string): Instrument | undefined => {
    return instruments.find(instrument => instrument.symbol === symbol);
  };

  return {
    instruments,
    loading,
    error,
    searchInstruments,
    validateInstrument,
    getInstrument,
  };
}
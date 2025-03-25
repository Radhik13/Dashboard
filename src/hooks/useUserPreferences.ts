import { useState, useEffect } from 'react';
import { MarketSession, UserPreferences } from '../types/markets';

const defaultPreferences: UserPreferences = {
  defaultSession: 'us',
  favoriteMarkets: ['us', 'crypto'],
  watchlists: [
    {
      id: 'default',
      name: 'Default Watchlist',
      instruments: ['AAPL', 'MSFT', 'GOOGL']
    }
  ],
  quickStats: {
    enabled: ['volume', 'volatility', 'sentiment', 'performance'],
    order: ['volume', 'volatility', 'sentiment', 'performance']
  },
  theme: 'system',
  chartLayout: {
    timeframe: '1D',
    indicators: ['SMA', 'RSI', 'MACD'],
    style: 'candles'
  }
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates
    }));
  };

  const toggleFavoriteMarket = (market: MarketSession) => {
    setPreferences(prev => ({
      ...prev,
      favoriteMarkets: prev.favoriteMarkets.includes(market)
        ? prev.favoriteMarkets.filter(m => m !== market)
        : [...prev.favoriteMarkets, market]
    }));
  };

  const addWatchlist = (name: string) => {
    setPreferences(prev => ({
      ...prev,
      watchlists: [
        ...prev.watchlists,
        {
          id: Date.now().toString(),
          name,
          instruments: []
        }
      ]
    }));
  };

  const updateWatchlist = (id: string, instruments: string[]) => {
    setPreferences(prev => ({
      ...prev,
      watchlists: prev.watchlists.map(w =>
        w.id === id ? { ...w, instruments } : w
      )
    }));
  };

  const updateQuickStats = (enabled: string[], order: string[]) => {
    setPreferences(prev => ({
      ...prev,
      quickStats: { enabled, order }
    }));
  };

  return {
    preferences,
    updatePreferences,
    toggleFavoriteMarket,
    addWatchlist,
    updateWatchlist,
    updateQuickStats
  };
}
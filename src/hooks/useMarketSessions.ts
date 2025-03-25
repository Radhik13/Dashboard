import { useState, useEffect } from 'react';
import { MarketSession, MarketSessionInfo, MarketStats } from '../types/markets';

const defaultSessions: Record<MarketSession, MarketSessionInfo> = {
  asia: {
    id: 'asia',
    name: 'Asian Session',
    description: 'Tokyo, Hong Kong, Singapore markets',
    timezone: 'Asia/Tokyo',
    openTime: '09:00',
    closeTime: '18:00',
    status: 'closed',
    mainIndices: ['Nikkei 225', 'Hang Seng', 'ASX 200'],
    keyPairs: ['USD/JPY', 'AUD/USD', 'NZD/USD']
  },
  europe: {
    id: 'europe',
    name: 'European Session',
    description: 'London, Frankfurt, Paris markets',
    timezone: 'Europe/London',
    openTime: '08:00',
    closeTime: '16:30',
    status: 'closed',
    mainIndices: ['FTSE 100', 'DAX', 'CAC 40'],
    keyPairs: ['EUR/USD', 'GBP/USD', 'EUR/GBP']
  },
  us: {
    id: 'us',
    name: 'US Session',
    description: 'New York, Chicago markets',
    timezone: 'America/New_York',
    openTime: '09:30',
    closeTime: '16:00',
    status: 'closed',
    mainIndices: ['S&P 500', 'Dow Jones', 'NASDAQ'],
    keyPairs: ['USD/CAD', 'USD/MXN', 'USD/BRL']
  },
  crypto: {
    id: 'crypto',
    name: 'Crypto Markets',
    description: '24/7 cryptocurrency trading',
    timezone: 'UTC',
    openTime: '00:00',
    closeTime: '23:59',
    status: 'open',
    mainIndices: ['BTC/USD', 'ETH/USD', 'BNB/USD'],
    keyPairs: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT']
  },
  commodities: {
    id: 'commodities',
    name: 'Commodities',
    description: 'Global commodities markets',
    timezone: 'UTC',
    openTime: '00:00',
    closeTime: '23:59',
    status: 'open',
    mainIndices: ['Gold', 'Silver', 'Oil'],
    keyPairs: ['XAU/USD', 'XAG/USD', 'USOIL']
  }
};

export function useMarketSessions() {
  const [sessions, setSessions] = useState<Record<MarketSession, MarketSessionInfo>>(defaultSessions);
  const [activeSession, setActiveSession] = useState<MarketSession>('us');
  const [stats, setStats] = useState<Record<MarketSession, MarketStats>>({} as Record<MarketSession, MarketStats>);

  useEffect(() => {
    // Update market status every minute
    const interval = setInterval(() => {
      setSessions(prev => {
        const now = new Date();
        const updated = { ...prev };

        Object.keys(updated).forEach(key => {
          const session = updated[key as MarketSession];
          const [openHour] = session.openTime.split(':').map(Number);
          const [closeHour] = session.closeTime.split(':').map(Number);
          const currentHour = now.getUTCHours();

          if (session.id === 'crypto' || session.id === 'commodities') {
            session.status = 'open';
          } else {
            session.status = currentHour >= openHour && currentHour < closeHour ? 'open' : 'closed';
          }
        });

        return updated;
      });

      // Simulate updating market stats
      setStats(prev => {
        const updated = { ...prev };
        Object.keys(defaultSessions).forEach(key => {
          updated[key as MarketSession] = {
            volume: Math.random() * 1000000,
            volatility: Math.random() * 100,
            sentiment: Math.random() > 0.5 ? 'bullish' : 'bearish',
            performance: (Math.random() * 2 - 1) * 5 // -5% to +5%
          };
        });
        return updated;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const switchSession = (session: MarketSession) => {
    setActiveSession(session);
    // Save to user preferences
    localStorage.setItem('defaultSession', session);
  };

  return {
    sessions,
    activeSession,
    switchSession,
    stats
  };
}
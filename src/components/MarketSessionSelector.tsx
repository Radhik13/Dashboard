import React from 'react';
import { Clock, Star, TrendingUp, Globe, DollarSign, Coins, Gem } from 'lucide-react';
import { MarketSession, MarketSessionInfo, MarketStats } from '../types/markets';
import { useUserPreferences } from '../hooks/useUserPreferences';

interface MarketSessionSelectorProps {
  sessions: Record<MarketSession, MarketSessionInfo>;
  activeSession: MarketSession;
  onSessionChange: (session: MarketSession) => void;
  stats: Record<MarketSession, MarketStats>;
}

const sessionIcons: Record<MarketSession, React.ElementType> = {
  asia: Globe,
  europe: Globe,
  us: DollarSign,
  crypto: Coins,
  commodities: Gem
};

export function MarketSessionSelector({
  sessions,
  activeSession,
  onSessionChange,
  stats
}: MarketSessionSelectorProps) {
  const { preferences, toggleFavoriteMarket } = useUserPreferences();

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-tv-blue" />
          <h2 className="text-xl font-semibold text-tv-text-primary">Market Sessions</h2>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Object.entries(sessions).map(([key, session]) => {
            const SessionIcon = sessionIcons[key as MarketSession];
            const sessionStats = stats[key as MarketSession];
            const isFavorite = preferences.favoriteMarkets.includes(key as MarketSession);

            return (
              <button
                key={key}
                onClick={() => onSessionChange(key as MarketSession)}
                className={`relative p-4 rounded-lg border transition-all ${
                  activeSession === key
                    ? 'bg-tv-blue bg-opacity-10 border-tv-blue'
                    : 'bg-tv-bg-primary border-tv-border hover:border-tv-blue'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <SessionIcon className="w-5 h-5 text-tv-blue" />
                    <h3 className="font-medium text-tv-text-primary">{session.name}</h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteMarket(key as MarketSession);
                    }}
                    className={`p-1 rounded-full ${
                      isFavorite ? 'text-yellow-400' : 'text-tv-text-secondary hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>

                <div className={`px-2 py-0.5 text-xs rounded-full inline-block mb-2 ${
                  session.status === 'open'
                    ? 'bg-tv-green bg-opacity-10 text-tv-green'
                    : session.status === 'pre-market'
                    ? 'bg-tv-blue bg-opacity-10 text-tv-blue'
                    : session.status === 'after-hours'
                    ? 'bg-tv-text-secondary bg-opacity-10 text-tv-text-secondary'
                    : 'bg-tv-red bg-opacity-10 text-tv-red'
                }`}>
                  {session.status.toUpperCase()}
                </div>

                <div className="text-xs text-tv-text-secondary mb-2">
                  {session.openTime} - {session.closeTime} ({session.timezone})
                </div>

                {sessionStats && (
                  <div className="mt-2 pt-2 border-t border-tv-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-tv-text-secondary">Performance</span>
                      <span className={sessionStats.performance >= 0 ? 'text-tv-green' : 'text-tv-red'}>
                        {sessionStats.performance >= 0 ? '+' : ''}{sessionStats.performance.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className={`w-4 h-4 ${
                        sessionStats.sentiment === 'bullish'
                          ? 'text-tv-green'
                          : sessionStats.sentiment === 'bearish'
                          ? 'text-tv-red'
                          : 'text-tv-text-secondary'
                      }`} />
                      <span className="text-xs text-tv-text-secondary capitalize">
                        {sessionStats.sentiment} Sentiment
                      </span>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
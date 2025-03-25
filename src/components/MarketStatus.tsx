import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useMarketStatus } from '../hooks/useMarketStatus';

export function MarketStatus() {
  const sessions = useMarketStatus();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    }).format(date);
  };

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-tv-blue" />
            <h2 className="text-xl font-semibold text-tv-text-primary">Market Sessions</h2>
          </div>
          <div className="text-lg font-medium text-tv-text-secondary">
            Current Time (UTC): {formatTime(currentTime)}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sessions.map((session) => (
            <div
              key={session.name}
              className={`p-4 rounded-lg border ${
                session.status === 'open'
                  ? 'bg-tv-bg-primary border-tv-green'
                  : 'bg-tv-bg-primary border-tv-border'
              }`}
            >
              <h3 className="font-medium text-tv-text-primary">{session.name}</h3>
              <div
                className={`text-sm mt-1 ${
                  session.status === 'open' ? 'text-tv-green' : 'text-tv-text-secondary'
                }`}
              >
                {session.status.toUpperCase()}
              </div>
              <div className="text-xs text-tv-text-secondary mt-2">
                {session.openTime} - {session.closeTime} UTC
              </div>
              {session.status === 'open' && session.nextCloseIn && (
                <div className="text-xs text-tv-red mt-1">
                  Closes in: {session.nextCloseIn}
                </div>
              )}
              {session.status === 'closed' && session.nextOpenIn && (
                <div className="text-xs text-tv-blue mt-1">
                  Opens in: {session.nextOpenIn}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
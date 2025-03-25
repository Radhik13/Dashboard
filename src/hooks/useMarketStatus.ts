import { useState, useEffect } from 'react';
import { MarketSession } from '../types/forex';

export function useMarketStatus() {
  const [sessions, setSessions] = useState<MarketSession[]>([
    {
      name: 'New Zealand (Wellington)',
      status: 'closed',
      openTime: '20:00',
      closeTime: '05:00',
    },
    {
      name: 'Sydney',
      status: 'closed',
      openTime: '21:00',
      closeTime: '06:00',
    },
    {
      name: 'Tokyo',
      status: 'closed',
      openTime: '23:00',
      closeTime: '08:00',
    },
    {
      name: 'Europe/Zurich (Switzerland)',
      status: 'closed',
      openTime: '07:00',
      closeTime: '16:00',
    },
    {
      name: 'Frankfurt (Eurozone)',
      status: 'closed',
      openTime: '07:00',
      closeTime: '16:00',
    },
    {
      name: 'London',
      status: 'closed',
      openTime: '08:00',
      closeTime: '17:00',
    },
    {
      name: 'Toronto (Canada)',
      status: 'closed',
      openTime: '13:00',
      closeTime: '22:00',
    },
    {
      name: 'New York',
      status: 'closed',
      openTime: '13:00',
      closeTime: '22:00',
    },
  ]);

  useEffect(() => {
    const updateMarketStatus = () => {
      const now = new Date();
      const currentHour = now.getUTCHours();

      setSessions((prevSessions) =>
        prevSessions.map((session) => {
          const [openHour] = session.openTime.split(':').map(Number);
          const [closeHour] = session.closeTime.split(':').map(Number);

          const isOpen =
            closeHour > openHour
              ? currentHour >= openHour && currentHour < closeHour
              : currentHour >= openHour || currentHour < closeHour;

          let nextOpenIn = '';
          let nextCloseIn = '';

          if (!isOpen) {
            const hoursUntilOpen =
              openHour > currentHour
                ? openHour - currentHour
                : 24 - currentHour + openHour;
            nextOpenIn = `${hoursUntilOpen}h`;
          } else {
            const hoursUntilClose =
              closeHour > currentHour
                ? closeHour - currentHour
                : 24 - currentHour + closeHour;
            nextCloseIn = `${hoursUntilClose}h`;
          }

          return {
            ...session,
            status: isOpen ? 'open' : 'closed',
            nextOpenIn: !isOpen ? nextOpenIn : undefined,
            nextCloseIn: isOpen ? nextCloseIn : undefined,
          };
        })
      );
    };

    updateMarketStatus();
    const interval = setInterval(updateMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return sessions;
}
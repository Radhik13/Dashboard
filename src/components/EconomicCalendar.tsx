import React from 'react';
import { EconomicCalendarWidget } from './EconomicCalendarWidget';
import { useTheme } from '../hooks/useTheme';

export function EconomicCalendar() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen bg-tv-bg-primary ${isDarkMode ? 'dark' : ''}`}>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <EconomicCalendarWidget />
      </main>
    </div>
  );
}
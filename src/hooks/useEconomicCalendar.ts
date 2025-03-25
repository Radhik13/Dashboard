import { useState, useEffect, useMemo } from 'react';
import { EconomicEvent, CalendarFilters, EventImpact, EventStatus } from '../types/calendar';
import { Currency } from '../types/forex';

const defaultFilters: CalendarFilters = {
  countries: [],
  impact: ['high'],
  dateRange: [null, null],
  categories: [],
  status: ['upcoming']
};

export function useEconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [filters, setFilters] = useState<CalendarFilters>(defaultFilters);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulated data fetch
    setLoading(true);
    const mockEvents: EconomicEvent[] = [
      {
        id: '1',
        title: 'FOMC Statement',
        country: 'USD',
        date: new Date(Date.now() + 3600000).toISOString(),
        impact: 'high',
        category: 'Central Bank',
        forecast: '5.25%',
        previous: '5.25%',
        description: 'Federal Open Market Committee Rate Decision and Statement',
        status: 'upcoming',
        volatilityExpected: 9,
        marketSentiment: 'neutral'
      },
      {
        id: '2',
        title: 'Non-Farm Payrolls',
        country: 'USD',
        date: new Date(Date.now() + 7200000).toISOString(),
        impact: 'high',
        category: 'Employment',
        forecast: '180K',
        previous: '216K',
        description: 'Change in the number of employed people during the previous month',
        status: 'upcoming',
        volatilityExpected: 8,
        marketSentiment: 'bullish'
      },
      {
        id: '3',
        title: 'ECB Interest Rate Decision',
        country: 'EUR',
        date: new Date(Date.now() + 10800000).toISOString(),
        impact: 'high',
        category: 'Central Bank',
        forecast: '4.50%',
        previous: '4.50%',
        description: 'ECB\'s decision on the main refinancing rate',
        status: 'upcoming',
        volatilityExpected: 7,
        marketSentiment: 'bearish'
      }
    ];

    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (filters.countries.length > 0 && !filters.countries.includes(event.country)) {
        return false;
      }
      if (filters.impact.length > 0 && !filters.impact.includes(event.impact)) {
        return false;
      }
      if (filters.status.length > 0 && !filters.status.includes(event.status)) {
        return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(event.category)) {
        return false;
      }
      if (filters.dateRange[0] && new Date(event.date) < filters.dateRange[0]) {
        return false;
      }
      if (filters.dateRange[1] && new Date(event.date) > filters.dateRange[1]) {
        return false;
      }
      return true;
    });
  }, [events, filters]);

  const updateFilters = (newFilters: Partial<CalendarFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const toggleCountryFilter = (country: Currency) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(country)
        ? prev.countries.filter(c => c !== country)
        : [...prev.countries, country]
    }));
  };

  const toggleImpactFilter = (impact: EventImpact) => {
    setFilters(prev => ({
      ...prev,
      impact: prev.impact.includes(impact)
        ? prev.impact.filter(i => i !== impact)
        : [...prev.impact, impact]
    }));
  };

  const toggleStatusFilter = (status: EventStatus) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  return {
    events: filteredEvents,
    filters,
    loading,
    updateFilters,
    toggleCountryFilter,
    toggleImpactFilter,
    toggleStatusFilter
  };
}
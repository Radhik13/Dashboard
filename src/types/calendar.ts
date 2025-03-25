import { Currency } from './forex';

export type EventImpact = 'low' | 'medium' | 'high';
export type EventStatus = 'upcoming' | 'ongoing' | 'completed';

export interface EconomicEvent {
  id: string;
  title: string;
  country: Currency;
  date: string;
  impact: EventImpact;
  category: string;
  forecast?: string;
  previous?: string;
  actual?: string;
  description?: string;
  status: EventStatus;
  volatilityExpected: number; // 1-10 scale
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface CalendarFilters {
  countries: Currency[];
  impact: EventImpact[];
  dateRange: [Date | null, Date | null];
  categories: string[];
  status: EventStatus[];
}

export interface CalendarSettings {
  timezone: string;
  showPastEvents: boolean;
  notificationsEnabled: boolean;
  defaultView: 'day' | 'week' | 'month';
  defaultFilters: Partial<CalendarFilters>;
}

export interface EventNotification {
  id: string;
  eventId: string;
  type: 'reminder' | 'alert';
  triggerTime: string;
  message: string;
  acknowledged: boolean;
}
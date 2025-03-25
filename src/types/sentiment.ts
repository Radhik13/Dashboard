export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  impact: 'high' | 'medium' | 'low';
  currency: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface COTReport {
  id: string;
  currency: string;
  date: string;
  longPositions: number;
  shortPositions: number;
  netPosition: number;
  weeklyChange: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface SocialSentiment {
  id: string;
  source: string;
  currency: string;
  timestamp: string;
  sentiment: number;
  volume: number;
  keywords: string[];
}

export interface Alert {
  id: string;
  type: 'news' | 'technical' | 'sentiment';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  acknowledged: boolean;
}
import { Currency } from './forex';
import { MarketType } from './markets';

export type NewsSource = 'financial' | 'social' | 'regulatory' | 'corporate';
export type NewsSentiment = 'bullish' | 'bearish' | 'neutral';
export type NewsImpact = 'high' | 'medium' | 'low';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: NewsSource;
  url: string;
  publishedAt: string;
  updatedAt?: string;
  assets: {
    type: MarketType;
    symbol: string;
    name: string;
  }[];
  currencies: Currency[];
  sentiment: NewsSentiment;
  impact: NewsImpact;
  credibilityScore: number; // 0-100
  relatedEvents?: string[]; // Economic event IDs
  categories: string[];
  tags: string[];
  metrics: {
    views: number;
    shares: number;
    reactions: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
}

export interface NewsFilters {
  sources: NewsSource[];
  assets: string[];
  currencies: Currency[];
  sentiment: NewsSentiment[];
  impact: NewsImpact[];
  dateRange: [Date | null, Date | null];
  categories: string[];
  tags: string[];
  minCredibilityScore: number;
}

export interface NewsSearchResult {
  item: NewsItem;
  relevanceScore: number;
  matchedTerms: string[];
  highlightRanges: {
    field: 'title' | 'summary' | 'content';
    start: number;
    end: number;
  }[];
}
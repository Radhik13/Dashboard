import { useState, useEffect, useMemo } from 'react';
import { NewsItem, NewsFilters, NewsSearchResult } from '../types/news';

const defaultFilters: NewsFilters = {
  sources: [],
  assets: [],
  currencies: [],
  sentiment: [],
  impact: ['high'],
  dateRange: [null, null],
  categories: [],
  tags: [],
  minCredibilityScore: 0
};

export function useNewsSearch() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filters, setFilters] = useState<NewsFilters>(defaultFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulated data fetch
    setLoading(true);
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Federal Reserve Maintains Interest Rates',
        summary: 'Fed keeps rates steady at 5.25%-5.50% range',
        content: 'The Federal Reserve maintained its benchmark interest rate...',
        source: 'financial',
        url: 'https://example.com/news/1',
        publishedAt: new Date().toISOString(),
        assets: [
          { type: 'forex', symbol: 'EUR/USD', name: 'Euro/US Dollar' }
        ],
        currencies: ['USD', 'EUR'],
        sentiment: 'neutral',
        impact: 'high',
        credibilityScore: 95,
        categories: ['monetary policy', 'central banks'],
        tags: ['FOMC', 'interest rates', 'USD'],
        metrics: {
          views: 15000,
          shares: 2500,
          reactions: {
            positive: 800,
            negative: 200,
            neutral: 1500
          }
        }
      }
      // Add more mock news items here
    ];

    setNews(mockNews);
    setLoading(false);
  }, []);

  const searchResults = useMemo((): NewsSearchResult[] => {
    if (!searchTerm && !Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f)) {
      return news.map(item => ({
        item,
        relevanceScore: 1,
        matchedTerms: [],
        highlightRanges: []
      }));
    }

    return news
      .filter(item => {
        // Apply filters
        if (filters.sources.length && !filters.sources.includes(item.source)) return false;
        if (filters.assets.length && !item.assets.some(a => filters.assets.includes(a.symbol))) return false;
        if (filters.currencies.length && !item.currencies.some(c => filters.currencies.includes(c))) return false;
        if (filters.sentiment.length && !filters.sentiment.includes(item.sentiment)) return false;
        if (filters.impact.length && !filters.impact.includes(item.impact)) return false;
        if (filters.categories.length && !filters.categories.some(c => item.categories.includes(c))) return false;
        if (filters.tags.length && !filters.tags.some(t => item.tags.includes(t))) return false;
        if (filters.minCredibilityScore > 0 && item.credibilityScore < filters.minCredibilityScore) return false;
        if (filters.dateRange[0] && new Date(item.publishedAt) < filters.dateRange[0]) return false;
        if (filters.dateRange[1] && new Date(item.publishedAt) > filters.dateRange[1]) return false;

        // Full-text search
        if (searchTerm) {
          const searchRegex = new RegExp(searchTerm, 'i');
          return (
            searchRegex.test(item.title) ||
            searchRegex.test(item.summary) ||
            searchRegex.test(item.content)
          );
        }

        return true;
      })
      .map(item => {
        // Calculate relevance and highlight matches
        const matchedTerms: string[] = [];
        const highlightRanges: NewsSearchResult['highlightRanges'] = [];
        let relevanceScore = 1;

        if (searchTerm) {
          const searchRegex = new RegExp(searchTerm, 'gi');
          let match;

          // Title matches (highest weight)
          while ((match = searchRegex.exec(item.title)) !== null) {
            highlightRanges.push({
              field: 'title',
              start: match.index,
              end: match.index + match[0].length
            });
            relevanceScore += 3;
          }

          // Summary matches (medium weight)
          searchRegex.lastIndex = 0;
          while ((match = searchRegex.exec(item.summary)) !== null) {
            highlightRanges.push({
              field: 'summary',
              start: match.index,
              end: match.index + match[0].length
            });
            relevanceScore += 2;
          }

          // Content matches (lowest weight)
          searchRegex.lastIndex = 0;
          while ((match = searchRegex.exec(item.content)) !== null) {
            highlightRanges.push({
              field: 'content',
              start: match.index,
              end: match.index + match[0].length
            });
            relevanceScore += 1;
          }

          matchedTerms.push(searchTerm);
        }

        // Adjust relevance based on credibility and recency
        relevanceScore *= (item.credibilityScore / 100);
        const hoursAgo = (Date.now() - new Date(item.publishedAt).getTime()) / (1000 * 60 * 60);
        relevanceScore *= Math.exp(-hoursAgo / 24); // Decay factor for older news

        return {
          item,
          relevanceScore,
          matchedTerms,
          highlightRanges
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }, [news, searchTerm, filters]);

  const updateFilters = (newFilters: Partial<NewsFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    results: searchResults,
    filters,
    searchTerm,
    loading,
    setSearchTerm,
    updateFilters
  };
}
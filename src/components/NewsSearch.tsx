import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Star,
  Share2,
  Eye,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import { useNewsSearch } from '../hooks/useNewsSearch';
import { NewsSource, NewsImpact, NewsSentiment } from '../types/news';

export function NewsSearch() {
  const {
    results,
    filters,
    searchTerm,
    loading,
    setSearchTerm,
    updateFilters
  } = useNewsSearch();

  const [expandedNews, setExpandedNews] = useState<string | null>(null);

  const sourceOptions: { value: NewsSource; label: string }[] = [
    { value: 'financial', label: 'Financial News' },
    { value: 'social', label: 'Social Media' },
    { value: 'regulatory', label: 'Regulatory' },
    { value: 'corporate', label: 'Corporate' }
  ];

  const impactOptions: { value: NewsImpact; label: string; color: string }[] = [
    { value: 'high', label: 'High Impact', color: 'bg-red-100 text-red-800' },
    { value: 'medium', label: 'Medium Impact', color: 'bg-orange-100 text-orange-800' },
    { value: 'low', label: 'Low Impact', color: 'bg-yellow-100 text-yellow-800' }
  ];

  const sentimentOptions: { value: NewsSentiment; label: string; icon: React.ElementType }[] = [
    { value: 'bullish', label: 'Bullish', icon: TrendingUp },
    { value: 'bearish', label: 'Bearish', icon: TrendingDown },
    { value: 'neutral', label: 'Neutral', icon: MessageSquare }
  ];

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-tv-text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search market news..."
              className="w-full pl-10 pr-4 py-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Source Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-tv-text-secondary" />
              <span className="text-tv-text-secondary">Sources:</span>
              <div className="flex gap-2">
                {sourceOptions.map(source => (
                  <button
                    key={source.value}
                    onClick={() => updateFilters({
                      sources: filters.sources.includes(source.value)
                        ? filters.sources.filter(s => s !== source.value)
                        : [...filters.sources, source.value]
                    })}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.sources.includes(source.value)
                        ? 'bg-tv-blue text-white'
                        : 'bg-tv-bg-primary text-tv-text-secondary'
                    }`}
                  >
                    {source.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Filter */}
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-tv-text-secondary" />
              <span className="text-tv-text-secondary">Impact:</span>
              <div className="flex gap-2">
                {impactOptions.map(impact => (
                  <button
                    key={impact.value}
                    onClick={() => updateFilters({
                      impact: filters.impact.includes(impact.value)
                        ? filters.impact.filter(i => i !== impact.value)
                        : [...filters.impact, impact.value]
                    })}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.impact.includes(impact.value)
                        ? impact.color
                        : 'bg-tv-bg-primary text-tv-text-secondary'
                    }`}
                  >
                    {impact.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sentiment Filter */}
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-tv-text-secondary" />
              <span className="text-tv-text-secondary">Sentiment:</span>
              <div className="flex gap-2">
                {sentimentOptions.map(sentiment => {
                  const Icon = sentiment.icon;
                  return (
                    <button
                      key={sentiment.value}
                      onClick={() => updateFilters({
                        sentiment: filters.sentiment.includes(sentiment.value)
                          ? filters.sentiment.filter(s => s !== sentiment.value)
                          : [...filters.sentiment, sentiment.value]
                      })}
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                        filters.sentiment.includes(sentiment.value)
                          ? 'bg-tv-blue text-white'
                          : 'bg-tv-bg-primary text-tv-text-secondary'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {sentiment.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8 text-tv-text-secondary">
            Loading news...
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-8 text-tv-text-secondary">
            No news found matching your search criteria
          </div>
        ) : (
          <div className="space-y-4">
            {results.map(({ item: news, highlightRanges }) => (
              <div
                key={news.id}
                className="bg-tv-bg-primary rounded-lg border border-tv-border overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-tv-text-secondary">
                        <span>{news.source.charAt(0).toUpperCase() + news.source.slice(1)}</span>
                        <span>•</span>
                        <span>{format(new Date(news.publishedAt), 'MMM d, yyyy HH:mm')}</span>
                      </div>
                      <h3 className="text-lg font-medium text-tv-text-primary mt-1">{news.title}</h3>
                      <p className="text-tv-text-secondary mt-2">{news.summary}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {news.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-tv-bg-secondary text-tv-text-secondary text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-2 ml-4">
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        news.sentiment === 'bullish'
                          ? 'bg-tv-green bg-opacity-10 text-tv-green'
                          : news.sentiment === 'bearish'
                          ? 'bg-tv-red bg-opacity-10 text-tv-red'
                          : 'bg-tv-bg-secondary text-tv-text-secondary'
                      }`}>
                        {news.sentiment.charAt(0).toUpperCase() + news.sentiment.slice(1)}
                      </div>
                      <button
                        onClick={() => setExpandedNews(expandedNews === news.id ? null : news.id)}
                        className="p-1 text-tv-text-secondary hover:text-tv-blue rounded"
                      >
                        {expandedNews === news.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedNews === news.id && (
                    <div className="mt-4 pt-4 border-t border-tv-border">
                      <div className="prose prose-sm max-w-none text-tv-text-primary">
                        {news.content}
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-tv-text-secondary">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {news.metrics.views.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {news.metrics.shares.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {Object.values(news.metrics.reactions).reduce((a, b) => a + b, 0).toLocaleString()}
                          </div>
                        </div>
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-tv-blue hover:underline"
                        >
                          Read More
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
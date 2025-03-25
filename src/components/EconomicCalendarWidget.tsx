import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Calendar,
  AlertTriangle,
  Bell,
  Filter,
  Clock,
  Flag,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useEconomicCalendar } from '../hooks/useEconomicCalendar';
import { EventImpact } from '../types/calendar';

export function EconomicCalendarWidget() {
  const {
    events,
    filters,
    loading,
    toggleCountryFilter,
    toggleImpactFilter
  } = useEconomicCalendar();

  const [showReminders, setShowReminders] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const impactColors: Record<EventImpact, string> = {
    low: 'bg-yellow-100 text-yellow-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800'
  };

  const impactIcons: Record<EventImpact, JSX.Element> = {
    low: <AlertTriangle className="w-4 h-4" />,
    medium: <AlertTriangle className="w-4 h-4" />,
    high: <AlertTriangle className="w-4 h-4 animate-pulse" />
  };

  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const setReminder = (eventId: string) => {
    console.log('Setting reminder for event:', eventId);
    setShowReminders(true);
  };

  return (
    <div className="bg-tv-bg-secondary rounded-lg border border-tv-border">
      <div className="p-4 border-b border-tv-border">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-tv-blue" />
          <h2 className="text-xl font-semibold text-tv-text-primary">Economic Calendar</h2>
        </div>
      </div>

      <div className="p-4">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-tv-text-secondary" />
            <span className="text-tv-text-secondary">Impact:</span>
          </div>
          {(['high', 'medium', 'low'] as EventImpact[]).map(impact => (
            <button
              key={impact}
              onClick={() => toggleImpactFilter(impact)}
              className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                filters.impact.includes(impact)
                  ? impactColors[impact]
                  : 'bg-tv-bg-secondary text-tv-text-secondary'
              }`}
            >
              {impactIcons[impact]}
              {impact.charAt(0).toUpperCase() + impact.slice(1)}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-tv-text-secondary">
              Loading events...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-tv-text-secondary">
              No events found matching your filters
            </div>
          ) : (
            events.map(event => (
              <div
                key={event.id}
                className="bg-tv-bg-primary rounded-lg border border-tv-border overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-tv-text-primary">{event.country}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                          impactColors[event.impact]
                        }`}>
                          {impactIcons[event.impact]}
                          {event.impact.charAt(0).toUpperCase() + event.impact.slice(1)} Impact
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-tv-text-primary mt-1">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-tv-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.date), 'MMM d, yyyy HH:mm')}
                        </div>
                        <div className="flex items-center gap-1">
                          {event.marketSentiment === 'bullish' ? (
                            <TrendingUp className="w-4 h-4 text-tv-green" />
                          ) : event.marketSentiment === 'bearish' ? (
                            <TrendingDown className="w-4 h-4 text-tv-red" />
                          ) : (
                            <div className="w-4 h-4 bg-tv-text-secondary rounded-full" />
                          )}
                          <span className="capitalize">{event.marketSentiment} Sentiment</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setReminder(event.id)}
                        className="p-2 text-tv-text-secondary hover:text-tv-blue rounded-lg"
                        title="Set Reminder"
                      >
                        <Bell className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleEventExpansion(event.id)}
                        className="p-2 text-tv-text-secondary hover:text-tv-blue rounded-lg"
                      >
                        {expandedEvent === event.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedEvent === event.id && (
                    <div className="mt-4 pt-4 border-t border-tv-border">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-tv-text-secondary">Expected</div>
                          <div className="text-tv-text-primary font-medium">{event.forecast || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-tv-text-secondary">Previous</div>
                          <div className="text-tv-text-primary font-medium">{event.previous || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-tv-text-secondary">Actual</div>
                          <div className="text-tv-text-primary font-medium">{event.actual || 'Pending'}</div>
                        </div>
                      </div>
                      {event.description && (
                        <div className="mt-4">
                          <div className="text-sm text-tv-text-secondary">Description</div>
                          <div className="text-tv-text-primary mt-1">{event.description}</div>
                        </div>
                      )}
                      <div className="mt-4">
                        <div className="text-sm text-tv-text-secondary">Expected Volatility</div>
                        <div className="mt-1 h-2 bg-tv-bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-tv-blue"
                            style={{ width: `${event.volatilityExpected * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reminders Modal */}
      {showReminders && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-tv-bg-secondary rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-tv-text-primary mb-4">Set Reminder</h2>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowReminders(false)}
                className="px-4 py-2 text-tv-text-secondary hover:text-tv-text-primary"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowReminders(false)}
                className="px-4 py-2 bg-tv-blue text-white rounded-lg hover:opacity-90"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
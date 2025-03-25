import React, { useState, useMemo } from 'react';
import { Brain, TrendingUp, AlertTriangle, Plus, ChevronDown, ChevronUp, LineChart, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';
import { Mood, PsychologyEntry, MoodPattern } from '../types/psychology';
import { useTheme } from '../hooks/useTheme';
import { StickyHeader } from '../components/StickyHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';

const moodOptions: { value: Mood; label: string }[] = [
  { value: 'confident', label: 'Confident' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'hesitant', label: 'Hesitant' },
  { value: 'greedy', label: 'Greedy' },
  { value: 'fearful', label: 'Fearful' },
  { value: 'focused', label: 'Focused' },
  { value: 'calm', label: 'Calm' },
  { value: 'other', label: 'Other' }
];

export function TradingPsychologyPage() {
  const { isDarkMode } = useTheme();
  const [entries, setEntries] = useState<PsychologyEntry[]>(() => {
    const saved = localStorage.getItem('psychologyEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<PsychologyEntry>>({
    mood: 'calm',
    stressLevel: 3,
    externalFactors: [],
    type: 'pre'
  });

  const moodPatterns = useMemo(() => {
    const patterns: Record<Mood, MoodPattern> = {} as Record<Mood, MoodPattern>;
    
    entries.forEach(entry => {
      if (!patterns[entry.mood]) {
        patterns[entry.mood] = {
          mood: entry.mood,
          winRate: 0,
          totalTrades: 0,
          averageProfit: 0
        };
      }
      patterns[entry.mood].totalTrades++;
      // Simulated win rate and profit calculations
      patterns[entry.mood].winRate = Math.random() * 100;
      patterns[entry.mood].averageProfit = Math.random() * 1000 - 500;
    });

    return Object.values(patterns);
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: PsychologyEntry = {
      id: Date.now().toString(),
      mood: newEntry.mood as Mood,
      customMood: newEntry.customMood,
      notes: newEntry.notes || '',
      timestamp: new Date().toISOString(),
      type: newEntry.type as 'pre' | 'post',
      stressLevel: newEntry.stressLevel || 3,
      externalFactors: newEntry.externalFactors || []
    };

    setEntries(prev => [...prev, entry]);
    localStorage.setItem('psychologyEntries', JSON.stringify([...entries, entry]));
    setShowForm(false);
    setNewEntry({
      mood: 'calm',
      stressLevel: 3,
      externalFactors: [],
      type: 'pre'
    });
  };

  const handleDelete = () => {
    if (!entryToDelete) return;

    setEntries(prev => prev.filter(entry => entry.id !== entryToDelete));
    localStorage.setItem('psychologyEntries', JSON.stringify(entries.filter(entry => entry.id !== entryToDelete)));
    setEntryToDelete(null);
    setShowDeleteConfirm(false);
  };

  const addExternalFactor = (factor: string) => {
    if (factor && !newEntry.externalFactors?.includes(factor)) {
      setNewEntry(prev => ({
        ...prev,
        externalFactors: [...(prev.externalFactors || []), factor]
      }));
    }
  };

  const removeExternalFactor = (factor: string) => {
    setNewEntry(prev => ({
      ...prev,
      externalFactors: prev.externalFactors?.filter(f => f !== factor) || []
    }));
  };

  return (
    <div className={`min-h-screen bg-tv-bg-primary ${isDarkMode ? 'dark' : ''}`}>
      <StickyHeader title="Trading Psychology">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </button>
          </div>
        </div>
      </StickyHeader>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-32">
        {/* Summary Section */}
        <div className="mb-8">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'summary' ? null : 'summary')}
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-tv-blue" />
              <h3 className="text-lg font-medium text-tv-text-primary">Performance Summary</h3>
            </div>
            {expandedSection === 'summary' ? (
              <ChevronUp className="w-5 h-5 text-tv-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-tv-text-secondary" />
            )}
          </div>
          
          {expandedSection === 'summary' && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moodPatterns.map(pattern => (
                <div
                  key={pattern.mood}
                  className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-tv-text-primary capitalize">{pattern.mood}</h4>
                    <span className="text-sm text-tv-text-secondary">{pattern.totalTrades} trades</span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tv-text-secondary">Win Rate</span>
                      <span className={`text-sm ${pattern.winRate >= 50 ? 'text-tv-green' : 'text-tv-red'}`}>
                        {pattern.winRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-tv-text-secondary">Avg. Profit</span>
                      <span className={`text-sm ${pattern.averageProfit >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
                        ${pattern.averageProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Entries Section */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'entries' ? null : 'entries')}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-tv-blue" />
              <h3 className="text-lg font-medium text-tv-text-primary">Psychology Entries</h3>
            </div>
            {expandedSection === 'entries' ? (
              <ChevronUp className="w-5 h-5 text-tv-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-tv-text-secondary" />
            )}
          </div>
          
          {expandedSection === 'entries' && (
            <div className="mt-4 space-y-4">
              {entries.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-tv-text-primary capitalize">
                        {entry.mood === 'other' ? entry.customMood : entry.mood}
                      </span>
                      <span className="text-xs text-tv-text-secondary">
                        {format(new Date(entry.timestamp), 'MMM d, yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        entry.type === 'pre' ? 'bg-tv-blue bg-opacity-10 text-tv-blue' : 'bg-tv-green bg-opacity-10 text-tv-green'
                      }`}>
                        {entry.type === 'pre' ? 'Pre-Trade' : 'Post-Trade'}
                      </span>
                      <button
                        onClick={() => {
                          setEntryToDelete(entry.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-tv-text-secondary hover:text-tv-red"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-tv-text-primary">{entry.notes}</p>
                  {entry.externalFactors.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {entry.externalFactors.map((factor, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs bg-tv-bg-primary text-tv-text-secondary rounded-full"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-tv-text-secondary" />
                    <span className="text-sm text-tv-text-secondary">
                      Stress Level: {entry.stressLevel}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Entry Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-tv-bg-secondary' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4 border border-tv-border`}>
            <h2 className="text-xl font-semibold text-tv-text-primary mb-4">New Psychology Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Entry Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={newEntry.type === 'pre'}
                      onChange={() => setNewEntry({ ...newEntry, type: 'pre' })}
                      className="text-tv-blue"
                    />
                    <span className="text-tv-text-primary">Pre-Trade</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={newEntry.type === 'post'}
                      onChange={() => setNewEntry({ ...newEntry, type: 'post' })}
                      className="text-tv-blue"
                    />
                    <span className="text-tv-text-primary">Post-Trade</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Current Mood
                </label>
                <select
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value as Mood })}
                  className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                >
                  {moodOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {newEntry.mood === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Custom Mood
                  </label>
                  <input
                    type="text"
                    value={newEntry.customMood || ''}
                    onChange={(e) => setNewEntry({ ...newEntry, customMood: e.target.value })}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                    required={newEntry.mood === 'other'}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Stress Level (1-5)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={newEntry.stressLevel}
                  onChange={(e) => setNewEntry({ ...newEntry, stressLevel: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-tv-text-secondary">
                  <span>Low Stress</span>
                  <span>High Stress</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Notes
                </label>
                <textarea
                  value={newEntry.notes || ''}
                  onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                  className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                  rows={3}
                  required
                  placeholder="Describe your thoughts, emotions, and any external factors affecting your trading mindset..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  External Factors
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a factor (e.g., lack of sleep, personal stress)"
                    className="flex-1 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExternalFactor((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a factor (e.g., lack of sleep, personal stress)"]') as HTMLInputElement;
                      addExternalFactor(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-tv-blue text-white rounded-lg hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newEntry.externalFactors?.map((factor, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-tv-bg-primary text-tv-text-secondary rounded-full text-sm"
                    >
                      {factor}
                      <button
                        type="button"
                        onClick={() => removeExternalFactor(factor)}
                        className="text-tv-text-secondary hover:text-tv-red"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-tv-text-secondary hover:text-tv-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tv-blue text-white rounded-lg hover:opacity-90"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message="Are you sure you want to delete this entry?"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setEntryToDelete(null);
        }}
      />
    </div>
  );
}
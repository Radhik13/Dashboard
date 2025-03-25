import React, { useState, useMemo } from 'react';
import { LineChart, Plus, ChevronDown, ChevronUp, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Strategy, StrategyIdea, TimeFrame } from '../types/backtesting';
import { useTheme } from '../hooks/useTheme';
import { StickyHeader } from './StickyHeader';
import { ConfirmDialog } from './ConfirmDialog';

const timeFrameOptions: { value: TimeFrame; label: string }[] = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '30m', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: 'Daily' },
  { value: '1w', label: 'Weekly' }
];

export function BacktestingLog() {
  const { isDarkMode } = useTheme();
  const [strategies, setStrategies] = useState<Strategy[]>(() => {
    const saved = localStorage.getItem('strategies');
    return saved ? JSON.parse(saved) : [];
  });

  const [ideas, setIdeas] = useState<StrategyIdea[]>(() => {
    const saved = localStorage.getItem('strategyIdeas');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>('strategies');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'strategy' | 'idea' } | null>(null);

  const [filter, setFilter] = useState({
    minWinRate: 0,
    minProfitFactor: 0,
    timeframe: '' as TimeFrame | '',
    status: '' as Strategy['status'] | ''
  });

  const [newStrategy, setNewStrategy] = useState<Partial<Strategy>>({
    timeframe: '1h',
    status: 'testing',
    strengths: [],
    weaknesses: []
  });

  const [newIdea, setNewIdea] = useState<Partial<StrategyIdea>>({});

  const filteredStrategies = useMemo(() => {
    return strategies.filter(strategy => {
      if (filter.minWinRate && strategy.winRate < filter.minWinRate) return false;
      if (filter.minProfitFactor && strategy.profitFactor < filter.minProfitFactor) return false;
      if (filter.timeframe && strategy.timeframe !== filter.timeframe) return false;
      if (filter.status && strategy.status !== filter.status) return false;
      return true;
    });
  }, [strategies, filter]);

  const handleAddStrategy = (e: React.FormEvent) => {
    e.preventDefault();
    const strategy: Strategy = {
      id: Date.now().toString(),
      name: newStrategy.name || '',
      timeframe: newStrategy.timeframe as string,
      tradesCount: Number(newStrategy.tradesCount) || 0,
      winRate: Number(newStrategy.winRate) || 0,
      profitFactor: Number(newStrategy.profitFactor) || 0,
      riskRewardRatio: Number(newStrategy.riskRewardRatio) || 0,
      strengths: newStrategy.strengths || [],
      weaknesses: newStrategy.weaknesses || [],
      notes: newStrategy.notes || '',
      status: newStrategy.status as Strategy['status'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setStrategies(prev => [...prev, strategy]);
    localStorage.setItem('strategies', JSON.stringify([...strategies, strategy]));
    setShowAddForm(false);
    setNewStrategy({
      timeframe: '1h',
      status: 'testing',
      strengths: [],
      weaknesses: []
    });
  };

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    const idea: StrategyIdea = {
      id: Date.now().toString(),
      name: newIdea.name || '',
      concept: newIdea.concept || '',
      hypothesis: newIdea.hypothesis || '',
      createdAt: new Date().toISOString()
    };

    setIdeas(prev => [...prev, idea]);
    localStorage.setItem('strategyIdeas', JSON.stringify([...ideas, idea]));
    setShowIdeaForm(false);
    setNewIdea({});
  };

  const handleDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'strategy') {
      setStrategies(prev => prev.filter(s => s.id !== itemToDelete.id));
      localStorage.setItem('strategies', JSON.stringify(strategies.filter(s => s.id !== itemToDelete.id)));
    } else {
      setIdeas(prev => prev.filter(i => i.id !== itemToDelete.id));
      localStorage.setItem('strategyIdeas', JSON.stringify(ideas.filter(i => i.id !== itemToDelete.id)));
    }

    setItemToDelete(null);
    setShowDeleteConfirm(false);
  };

  const convertIdeaToStrategy = (idea: StrategyIdea) => {
    setNewStrategy({
      name: idea.name,
      notes: `Concept: ${idea.concept}\n\nHypothesis: ${idea.hypothesis}`,
      timeframe: '1h',
      status: 'testing',
      strengths: [],
      weaknesses: []
    });
    setIdeas(prev => prev.filter(i => i.id !== idea.id));
    localStorage.setItem('strategyIdeas', JSON.stringify(ideas.filter(i => i.id !== idea.id)));
    setShowAddForm(true);
  };

  const addPoint = (type: 'strength' | 'weakness', point: string) => {
    if (point) {
      setNewStrategy(prev => ({
        ...prev,
        [type === 'strength' ? 'strengths' : 'weaknesses']: [
          ...(prev[type === 'strength' ? 'strengths' : 'weaknesses'] || []),
          point
        ]
      }));
    }
  };

  const removePoint = (type: 'strength' | 'weakness', index: number) => {
    setNewStrategy(prev => ({
      ...prev,
      [type === 'strength' ? 'strengths' : 'weaknesses']: (
        prev[type === 'strength' ? 'strengths' : 'weaknesses'] || []
      ).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={`min-h-screen bg-tv-bg-primary ${isDarkMode ? 'dark' : ''}`}>
      <StickyHeader title="Backtesting Log">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setShowIdeaForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-tv-bg-secondary text-tv-text-secondary rounded-lg hover:text-tv-text-primary border border-tv-border"
              >
                <Plus className="w-4 h-4" />
                New Idea
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                New Strategy
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                Min Win Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={filter.minWinRate}
                onChange={(e) => setFilter({ ...filter, minWinRate: Number(e.target.value) })}
                className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                Min Profit Factor
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={filter.minProfitFactor}
                onChange={(e) => setFilter({ ...filter, minProfitFactor: Number(e.target.value) })}
                className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                Timeframe
              </label>
              <select
                value={filter.timeframe}
                onChange={(e) => setFilter({ ...filter, timeframe: e.target.value as TimeFrame })}
                className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary"
              >
                <option value="">All</option>
                {timeFrameOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                Status
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value as Strategy['status'] })}
                className="w-full p-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary"
              >
                <option value="">All</option>
                <option value="idea">Idea</option>
                <option value="testing">Testing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </StickyHeader>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-40">
        {/* Strategies */}
        <div className="mb-8">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'strategies' ? null : 'strategies')}
          >
            <h3 className="text-lg font-medium text-tv-text-primary">Strategies</h3>
            {expandedSection === 'strategies' ? (
              <ChevronUp className="w-5 h-5 text-tv-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-tv-text-secondary" />
            )}
          </div>
          
          {expandedSection === 'strategies' && (
            <div className="mt-4 space-y-4">
              {filteredStrategies.map(strategy => (
                <div
                  key={strategy.id}
                  className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-tv-text-primary">{strategy.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-tv-text-secondary">{strategy.timeframe}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          strategy.status === 'completed'
                            ? 'bg-tv-green bg-opacity-10 text-tv-green'
                            : strategy.status === 'testing'
                            ? 'bg-tv-blue bg-opacity-10 text-tv-blue'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {strategy.status.charAt(0).toUpperCase() + strategy.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingStrategy(strategy)}
                        className="p-1 text-tv-text-secondary hover:text-tv-blue"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ id: strategy.id, type: 'strategy' });
                          setShowDeleteConfirm(true);
                        }}
                        className="p-1 text-tv-text-secondary hover:text-tv-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-sm text-tv-text-secondary">Win Rate</div>
                      <div className={`text-lg font-medium ${
                        strategy.winRate >= 50 ? 'text-tv-green' : 'text-tv-red'
                      }`}>
                        {strategy.winRate}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-tv-text-secondary">Profit Factor</div>
                      <div className={`text-lg font-medium ${
                        strategy.profitFactor >= 1.5 ? 'text-tv-green' : 'text-tv-red'
                      }`}>
                        {strategy.profitFactor.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-tv-text-secondary">Risk/Reward</div>
                      <div className="text-lg font-medium text-tv-text-primary">
                        1:{strategy.riskRewardRatio.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-tv-text-secondary mb-2">Strengths</div>
                    <div className="flex flex-wrap gap-2">
                      {strategy.strengths.map((strength, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-tv-green bg-opacity-10 text-tv-green text-sm rounded-full"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-tv-text-secondary mb-2">Weaknesses</div>
                    <div className="flex flex-wrap gap-2">
                      {strategy.weaknesses.map((weakness, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-tv-red bg-opacity-10 text-tv-red text-sm rounded-full"
                        >
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>

                  {strategy.notes && (
                    <div className="mt-4">
                      <div className="text-sm text-tv-text-secondary mb-2">Notes</div>
                      <p className="text-sm text-tv-text-primary whitespace-pre-line">{strategy.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ideas */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setExpandedSection(expandedSection === 'ideas' ? null : 'ideas')}
          >
            <h3 className="text-lg font-medium text-tv-text-primary">Strategy Ideas</h3>
            {expandedSection === 'ideas' ? (
              <ChevronUp className="w-5 h-5 text-tv-text-secondary" />
            ) : (
              <ChevronDown className="w-5 h-5 text-tv-text-secondary" />
            )}
          </div>
          
          {expandedSection === 'ideas' && (
            <div className="mt-4 space-y-4">
              {ideas.map(idea => (
                <div
                  key={idea.id}
                  className="p-4 bg-tv-bg-secondary rounded-lg border border-tv-border"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-tv-text-primary">{idea.name}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => convertIdeaToStrategy(idea)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-tv-blue hover:bg-tv-blue hover:bg-opacity-10 rounded"
                      >
                        <ArrowRight className="w-4 h-4" />
                        Convert to Strategy
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete({ id: idea.id, type: 'idea' });
                          setShowDeleteConfirm(true);
                        }}
                        className="p-1 text-tv-text-secondary hover:text-tv-red"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-tv-text-secondary mb-1">Concept</div>
                    <p className="text-sm text-tv-text-primary">{idea.concept}</p>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-tv-text-secondary mb-1">Hypothesis</div>
                    <p className="text-sm text-tv-text-primary">{idea.hypothesis}</p>
                  </div>

                  <div className="text-xs text-tv-text-secondary mt-4">
                    Created {format(new Date(idea.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Strategy Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-tv-bg-secondary' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4 border border-tv-border`}>
            <h2 className="text-xl font-semibold text-tv-text-primary mb-4">New Strategy</h2>
            <form onSubmit={handleAddStrategy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Strategy Name
                </label>
                <input
                  type="text"
                  value={newStrategy.name || ''}
                  onChange={(e) => setNewStrategy({ ...newStrategy, name: e.target.value })}
                  className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Timeframe
                  </label>
                  <select
                    value={newStrategy.timeframe}
                    onChange={(e) => setNewStrategy({ ...newStrategy, timeframe: e.target.value })}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    required
                  >
                    {timeFrameOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Status
                  </label>
                  <select
                    value={newStrategy.status}
                    onChange={(e) => setNewStrategy({ ...newStrategy, status: e.target.value as Strategy['status'] })}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    required
                  >
                    <option value="idea">Idea</option>
                    <option value="testing">Testing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Number of Trades
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newStrategy.tradesCount || ''}
                    onChange={(e) => setNewStrategy({ ...newStrategy, tradesCount: Number(e.target.value) })}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Win Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStrategy.winRate || ''}
                    onChange={(e) => setNewStrategy({ ...newStrategy, winRate: Number(e.target.value) })}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Profit Factor
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={newStrategy.profitFactor || ''}
                    onChange={(e) => setNewStrategy({ ...newStrategy, profitFactor: Number(e.target.value) })}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Risk/Reward Ratio
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={newStrategy.riskRewardRatio || ''}
                    onChange={(e) => setNewStrategy({ ...newStrategy, riskRewardRatio: Number(e.target.value) })}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Strengths
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a strength"
                    className="flex-1 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPoint('strength', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a strength"]') as HTMLInputElement;
                      addPoint('strength', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newStrategy.strengths?.map((strength, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-tv-green bg-opacity-10 text-tv-green rounded-full text-sm"
                    >
                      {strength}
                      <button
                        type="button"
                        onClick={() => removePoint('strength', index)}
                        className="text-tv-green hover:text-tv-red"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Weaknesses
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a weakness"
                    className="flex-1 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPoint('weakness', (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add a weakness"]') as HTMLInputElement;
                      addPoint('weakness', input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-tv-red text-white rounded-lg hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newStrategy.weaknesses?.map((weakness, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-tv-red bg-opacity-10 text-tv-red rounded-full text-sm"
                    >
                      {weakness}
                      <button
                        type="button"
                        onClick={() => removePoint('weakness', index)}
                        className="text-tv-red hover:opacity-70"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Notes
                </label>
                <textarea
                  value={newStrategy.notes || ''}
                  onChange={(e) => setNewStrategy({ ...newStrategy, notes: e.target.value })}
                  className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-tv-text-secondary hover:text-tv-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tv-blue text-white rounded-lg hover:opacity-90"
                >
                  Save Strategy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Idea Form */}
      {showIdeaForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-tv-bg-secondary' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4 border border-tv-border`}>
            <h2 className="text-xl font-semibold text-tv-text-primary mb-4">New Strategy Idea</h2>
            <form onSubmit={handleAddIdea} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Idea Name
                </label>
                <input
                  type="text"
                  value={newIdea.name || ''}
                  onChange={(e) => setNewIdea({ ...newIdea, name: e.target.value })}
                  className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Concept
                </label>
                <textarea
                  value={newIdea.concept || ''}
                  onChange={(e) => setNewIdea({ ...newIdea, concept: e.target.value })}
                  className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                  Hypothesis
                </label>
                <textarea
                  value={newIdea.hypothesis || ''}
                  onChange={(e) => setNewIdea({ ...newIdea, hypothesis: e.target.value })}
                  className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowIdeaForm(false)}
                  className="px-4 py-2 text-tv-text-secondary hover:text-tv-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-tv-blue text-white rounded-lg hover:opacity-90"
                >
                  Save Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        message={`Are you sure you want to delete this ${itemToDelete?.type}?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
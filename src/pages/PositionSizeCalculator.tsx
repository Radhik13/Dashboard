import React, { useState } from 'react';
import {
  Calculator,
  RefreshCcw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Save,
  Download,
  Upload,
  Settings,
  DollarSign,
  Percent,
  Hash
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useCalculator } from '../hooks/useCalculator';
import { InstrumentSearch } from '../components/InstrumentSearch';
import { StickyHeader } from '../components/StickyHeader';
import { MarketType, Template, Instrument } from '../types/calculator';

export function PositionSizeCalculator() {
  const { isDarkMode } = useTheme();
  const { state, setState, calculatePositionSize, validateInputs } = useCalculator();
  const [expandedSections, setExpandedSections] = useState({
    advanced: false,
    margin: false,
    breakeven: false
  });

  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('calculatorTemplates');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Common preset risk percentages
  const riskPresets = [1, 2, 3, 5];

  const marketTypes: { value: MarketType; label: string; icon: React.ElementType }[] = [
    { value: 'forex', label: 'Forex', icon: DollarSign },
    { value: 'stocks', label: 'Stocks', icon: Hash },
    { value: 'crypto', label: 'Crypto', icon: DollarSign },
    { value: 'futures', label: 'Futures', icon: Hash },
    { value: 'options', label: 'Options', icon: Percent }
  ];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const saveTemplate = () => {
    const name = prompt('Enter template name:');
    if (name) {
      const newTemplate: Template = {
        id: Date.now().toString(),
        name,
        marketType: state.marketType,
        settings: { ...state }
      };
      setTemplates(prev => [...prev, newTemplate]);
      localStorage.setItem('calculatorTemplates', JSON.stringify([...templates, newTemplate]));
    }
  };

  const loadTemplate = (template: Template) => {
    setState(prev => ({
      ...prev,
      ...template.settings
    }));
  };

  const handleRefreshData = () => {
    setLastUpdate(new Date());
  };

  const handleInstrumentSelect = (instrument: Instrument) => {
    setState(prev => ({
      ...prev,
      instrument: instrument.symbol
    }));
  };

  const calculations = calculatePositionSize();
  const validation = validateInputs();

  return (
    <div className={`min-h-screen bg-tv-bg-primary ${isDarkMode ? 'dark' : ''}`}>
      <StickyHeader title="Position Size Calculator">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {marketTypes.map(market => (
              <button
                key={market.value}
                onClick={() => setState(prev => ({ ...prev, marketType: market.value }))}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  state.marketType === market.value
                    ? 'bg-tv-blue text-white'
                    : 'bg-tv-bg-secondary text-tv-text-secondary hover:text-tv-text-primary border border-tv-border'
                }`}
              >
                <market.icon className="w-5 h-5" />
                <span>{market.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefreshData}
              className="flex items-center gap-2 px-4 py-2 bg-tv-bg-secondary text-tv-text-secondary rounded-lg hover:text-tv-text-primary border border-tv-border"
            >
              <RefreshCcw className="w-5 h-5" />
              Refresh Data
            </button>
            <button
              onClick={saveTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
            >
              <Save className="w-5 h-5" />
              Save Template
            </button>
          </div>
        </div>
      </StickyHeader>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-tv-bg-secondary rounded-lg border border-tv-border p-4">
              <h2 className="text-lg font-medium text-tv-text-primary mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Account Currency
                  </label>
                  <select
                    value={state.accountCurrency}
                    onChange={(e) => setState(prev => ({ ...prev, accountCurrency: e.target.value as any }))}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                  >
                    {['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD'].map(currency => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Account Balance
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={state.customBalance ?? state.accountBalance}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        customBalance: parseFloat(e.target.value) || null
                      }))}
                      className="flex-1 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    />
                    <button
                      onClick={() => setState(prev => ({ ...prev, customBalance: null }))}
                      className="px-4 py-2 bg-tv-bg-primary text-tv-text-secondary hover:text-tv-text-primary border border-tv-border rounded-lg"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Risk Percentage
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={state.riskPercentage}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        riskPercentage: parseFloat(e.target.value)
                      }))}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {riskPresets.map(preset => (
                          <button
                            key={preset}
                            onClick={() => setState(prev => ({ ...prev, riskPercentage: preset }))}
                            className={`px-3 py-1 rounded-full text-sm ${
                              state.riskPercentage === preset
                                ? 'bg-tv-blue text-white'
                                : 'bg-tv-bg-primary text-tv-text-secondary hover:text-tv-text-primary'
                            }`}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>
                      <span className="text-tv-text-primary font-medium">
                        {state.riskPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Settings */}
            <div className="bg-tv-bg-secondary rounded-lg border border-tv-border p-4">
              <h2 className="text-lg font-medium text-tv-text-primary mb-4">Trade Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Instrument
                  </label>
                  <InstrumentSearch
                    marketType={state.marketType}
                    value={state.instrument}
                    onChange={handleInstrumentSelect}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Entry Price
                  </label>
                  <input
                    type="number"
                    value={state.entryPrice}
                    onChange={(e) => setState(prev => ({
                      ...prev,
                      entryPrice: parseFloat(e.target.value) || 0
                    }))}
                    className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    step="0.00001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Stop Loss
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      value={state.stopLoss}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        stopLoss: parseFloat(e.target.value) || 0
                      }))}
                      className="flex-1 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    />
                    <select
                      value={state.stopLossUnit}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        stopLossUnit: e.target.value as any
                      }))}
                      className="w-32 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    >
                      <option value="pips">Pips</option>
                      <option value="points">Points</option>
                      <option value="dollars">Dollars</option>
                      <option value="percent">Percent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                    Take Profit Levels
                  </label>
                  <div className="space-y-2">
                    {state.takeProfitLevels.map((level, index) => (
                      <div key={index} className="flex gap-4">
                        <input
                          type="number"
                          value={level.price}
                          onChange={(e) => {
                            const newLevels = [...state.takeProfitLevels];
                            newLevels[index].price = parseFloat(e.target.value) || 0;
                            setState(prev => ({ ...prev, takeProfitLevels: newLevels }));
                          }}
                          className="flex-1 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                          placeholder="Price"
                          step="0.00001"
                        />
                        <input
                          type="number"
                          value={level.percentage}
                          onChange={(e) => {
                            const newLevels = [...state.takeProfitLevels];
                            newLevels[index].percentage = parseFloat(e.target.value) || 0;
                            setState(prev => ({ ...prev, takeProfitLevels: newLevels }));
                          }}
                          className="w-24 p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                          placeholder="%"
                          min="0"
                          max="100"
                        />
                        {index > 0 && (
                          <button
                            onClick={() => {
                              const newLevels = state.takeProfitLevels.filter((_, i) => i !== index);
                              setState(prev => ({ ...prev, takeProfitLevels: newLevels }));
                            }}
                            className="p-2 text-tv-text-secondary hover:text-tv-red"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setState(prev => ({
                        ...prev,
                        takeProfitLevels: [...prev.takeProfitLevels, { price: 0, percentage: 0 }]
                      }))}
                      className="text-sm text-tv-blue hover:text-opacity-80"
                    >
                      + Add Take Profit Level
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-tv-bg-secondary rounded-lg border border-tv-border p-4">
              <button
                onClick={() => toggleSection('advanced')}
                className="flex items-center justify-between w-full"
              >
                <h2 className="text-lg font-medium text-tv-text-primary">Advanced Settings</h2>
                {expandedSections.advanced ? (
                  <ChevronUp className="w-5 h-5 text-tv-text-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-tv-text-secondary" />
                )}
              </button>
              
              {expandedSections.advanced && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                      Leverage
                    </label>
                    <select
                      value={state.leverage}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        leverage: parseInt(e.target.value)
                      }))}
                      className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    >
                      {[1, 2, 5, 10, 20, 50, 100, 200, 500].map(lev => (
                        <option key={lev} value={lev}>1:{lev}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                      Commission (per lot)
                    </label>
                    <input
                      type="number"
                      value={state.commission}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        commission: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                      Spread (pips)
                    </label>
                    <input
                      type="number"
                      value={state.spread}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        spread: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                      step="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tv-text-secondary mb-1">
                      Slippage (pips)
                    </label>
                    <input
                      type="number"
                      value={state.slippage}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        slippage: parseFloat(e.target.value) || 0
                      }))}
                      className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary"
                      step="0.1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-tv-bg-secondary rounded-lg border border-tv-border p-4">
              <h2 className="text-lg font-medium text-tv-text-primary mb-4">Position Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                  <div className="text-sm text-tv-text-secondary">Position Size</div>
                  <div className="text-2xl font-bold text-tv-text-primary">
                    {calculations.size.toFixed(2)} {state.marketType === 'forex' ? 'lots' : 'units'}
                  </div>
                </div>

                <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                  <div className="text-sm text-tv-text-secondary">Risk Amount</div>
                  <div className="text-2xl font-bold text-tv-text-primary">
                    ${calculations.riskAmount.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                  <div className="text-sm text-tv-text-secondary">Potential Profit</div>
                  <div className="text-2xl font-bold text-tv-green">
                    ${calculations.potentialProfit.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                  <div className="text-sm text-tv-text-secondary">Risk/Reward Ratio</div>
                  <div className="text-2xl font-bold text-tv-text-primary">
                    1:{calculations.riskRewardRatio.toFixed(2)}
                  </div>
                </div>
              </div>

              {!validation.isValid && (
                <div className="mt-4 p-4 bg-tv-red bg-opacity-10 rounded-lg flex items-center gap-2 text-tv-red">
                  <AlertTriangle className="w-5 h-5" />
                  <span>{validation.message}</span>
                </div>
              )}

              {state.riskPercentage > 2 && (
                <div className="mt-4 p-4 bg-tv-red bg-opacity-10 rounded-lg flex items-center gap-2 text-tv-red">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Warning: Risk percentage exceeds recommended 2% maximum</span>
                </div>
              )}
            </div>

            {/* Margin Calculator */}
            <div className="bg-tv-bg-secondary rounded-lg border border-tv-border p-4">
              <button
                onClick={() => toggleSection('margin')}
                className="flex items-center justify-between w-full"
              >
                <h2 className="text-lg font-medium text-tv-text-primary">Margin Calculator</h2>
                {expandedSections.margin ? (
                  <ChevronUp className="w-5 h-5 text-tv-text-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-tv-text-secondary" />
                )}
              </button>
              
              {expandedSections.margin && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                    <div className="text-sm text-tv-text-secondary">Required Margin</div>
                    <div className="text-2xl font-bold text-tv-text-primary">
                      ${calculations.margin.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                    <div className="text-sm text-tv-text-secondary">Free Margin</div>
                    <div className="text-2xl font-bold text-tv-text-primary">
                      ${(state.accountBalance - calculations.margin).toFixed(2)}
                    </div>
                  </div>

                  <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                    <div className="text-sm text-tv-text-secondary">Commission</div>
                    <div className="text-2xl font-bold text-tv-text-primary">
                      ${calculations.commission.toFixed(2)}
                    </div>
                  </div>

                  <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                    <div className="text-sm text-tv-text-secondary">Total Cost</div>
                    <div className="text-2xl font-bold text-tv-text-primary">
                      ${calculations.totalCost.toFixed(2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Break-even Calculator */}
            <div className="bg-tv-bg-secondary rounded-lg border border-tv-border p-4">
              <button
                onClick={() => toggleSection('breakeven')}
                className="flex items-center justify-between w-full"
              >
                <h2 className="text-lg font-medium text-tv-text-primary">Break-even Calculator</h2>
                {expandedSections.breakeven ? (
                  <ChevronUp className="w-5 h-5 text-tv-text-secondary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-tv-text-secondary" />
                )}
              </button>
              
              {expandedSections.breakeven && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-tv-bg-primary rounded-lg border border-tv-border">
                    <div className="text-sm text-tv-text-secondary">Break-even Price</div>
                    <div className="text-2xl font-bold text-tv-text-primary">
                      {(state.entryPrice + (state.spread * 0.0001)).toFixed(5)}
                    </div>
                    <div className="text-sm text-tv-text-secondary mt-1">
                      Including spread and commission
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Templates */}
            <div className="bg-tv-bg-secondary rounded-lg border border-tv-border p-4">
              <h2 className="text-lg font-medium text-tv-text-primary mb-4">Saved Templates</h2>
              <div className="space-y-2">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="w-full p-3 bg-tv-bg-primary rounded-lg border border-tv-border text-left hover:border-tv-blue transition-colors"
                  >
                    <div className="font-medium text-tv-text-primary">{template.name}</div>
                    <div className="text-sm text-tv-text-secondary mt-1">
                      Risk: {template.settings.riskPercentage}% | 
                      Leverage: 1:{template.settings.leverage}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
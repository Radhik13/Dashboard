import React, { useState } from 'react';
import Select from 'react-select';
import { Resource, MarketType } from '../types/markets';
import { useTheme } from '../hooks/useTheme';

interface EditResourceFormProps {
  resource: Resource;
  onSave: (resource: Resource) => void;
  onClose: () => void;
}

export function EditResourceForm({ resource, onSave, onClose }: EditResourceFormProps) {
  const { isDarkMode } = useTheme();
  const [editedResource, setEditedResource] = useState<Resource>(resource);

  const marketOptions = [
    { value: 'forex', label: 'Forex' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'tools', label: 'Trading Tools' },
    { value: 'misc', label: 'Miscellaneous' }
  ];

  const categoryOptions = [
    { value: 'Trading Brokers', label: 'Trading Brokers' },
    { value: 'Learning Platforms', label: 'Learning Platforms' },
    { value: 'Market Analysis & News', label: 'Market Analysis & News' },
    { value: 'Economic Calendars', label: 'Economic Calendars' },
    { value: 'Trading Communities', label: 'Trading Communities' },
    { value: 'Trading Tools & Calculators', label: 'Trading Tools & Calculators' },
    { value: 'Educational Resources', label: 'Educational Resources' },
    { value: 'Miscellaneous Tools', label: 'Miscellaneous Tools' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedResource);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${isDarkMode ? 'bg-tv-bg-secondary' : 'bg-white'} rounded-lg p-6 max-w-2xl w-full mx-4 border border-tv-border`}>
        <h2 className="text-xl font-semibold text-tv-text-primary mb-4">Edit Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-tv-text-secondary mb-1">
              Resource Name
            </label>
            <input
              type="text"
              value={editedResource.name}
              onChange={(e) => setEditedResource({ ...editedResource, name: e.target.value })}
              className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tv-text-secondary mb-1">
              URL
            </label>
            <input
              type="url"
              value={editedResource.url}
              onChange={(e) => setEditedResource({ ...editedResource, url: e.target.value })}
              className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tv-text-secondary mb-1">
              Description
            </label>
            <textarea
              value={editedResource.description}
              onChange={(e) => setEditedResource({ ...editedResource, description: e.target.value })}
              className="w-full p-2 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tv-text-secondary mb-1">
              Market
            </label>
            <Select
              options={marketOptions}
              value={marketOptions.find(option => option.value === editedResource.market)}
              onChange={(option) => setEditedResource({ ...editedResource, market: option?.value as MarketType })}
              className="text-sm"
              classNames={{
                control: () => 'bg-tv-bg-primary border-tv-border rounded-lg text-tv-text-primary'
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  neutral0: isDarkMode ? '#1e222d' : '#ffffff',
                  neutral80: isDarkMode ? '#d1d4dc' : '#131722',
                  primary: '#2962ff',
                },
              })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-tv-text-secondary mb-1">
              Category
            </label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find(option => option.value === editedResource.category)}
              onChange={(option) => setEditedResource({ ...editedResource, category: option?.value })}
              className="text-sm"
              classNames={{
                control: () => 'bg-tv-bg-primary border-tv-border rounded-lg text-tv-text-primary'
              }}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  neutral0: isDarkMode ? '#1e222d' : '#ffffff',
                  neutral80: isDarkMode ? '#d1d4dc' : '#131722',
                  primary: '#2962ff',
                },
              })}
              required
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-tv-text-secondary hover:text-tv-text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-tv-blue text-white rounded-lg hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
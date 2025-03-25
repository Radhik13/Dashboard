import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { 
  GraduationCap, LineChart, Calendar, Users, Calculator, ArrowLeft, Search, 
  Building2, BookOpen, Brain, PenTool as Tool, Library, Coins, 
  DollarSign, BarChart3, Gem, Wrench, Plus, Edit2, Trash2
} from 'lucide-react';
import { Resource, MarketType } from '../types/markets';
import { AddResourceForm } from './AddResourceForm';
import { EditResourceForm } from './EditResourceForm';
import { resources as defaultResources } from '../data/resources';
import { useTheme } from '../hooks/useTheme';
import { StickyHeader } from './StickyHeader';

export function Resources() {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('forex');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resources, setResources] = useState<Resource[]>(() => {
    const saved = localStorage.getItem('resources');
    if (saved) {
      return JSON.parse(saved);
    }
    return Object.values(defaultResources).flat();
  });

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  const marketOptions = [
    { value: 'forex', label: 'Forex', icon: DollarSign },
    { value: 'stocks', label: 'Stocks', icon: BarChart3 },
    { value: 'crypto', label: 'Crypto', icon: Coins },
    { value: 'commodities', label: 'Commodities', icon: Gem },
    { value: 'tools', label: 'Trading Tools', icon: Wrench },
    { value: 'misc', label: 'Miscellaneous', icon: Tool }
  ];

  const handleAddResource = (newResource: Resource) => {
    setResources(prev => [...prev, newResource]);
    setShowAddForm(false);
  };

  const handleEditResource = (updatedResource: Resource) => {
    setResources(prev => prev.map(resource =>
      resource.name === editingResource?.name ? updatedResource : resource
    ));
    setEditingResource(null);
  };

  const handleDeleteResource = (resourceToDelete: Resource) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(prev => prev.filter(resource => 
        resource.name !== resourceToDelete.name
      ));
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = 
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMarket = resource.market === selectedMarket;
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;

      return matchesSearch && matchesMarket && matchesCategory;
    });
  }, [resources, searchTerm, selectedMarket, selectedCategory]);

  const groupedResources = useMemo(() => {
    const grouped: Record<string, Resource[]> = {};
    
    filteredResources.forEach(resource => {
      if (!grouped[resource.category]) {
        grouped[resource.category] = [];
      }
      grouped[resource.category].push(resource);
    });

    return grouped;
  }, [filteredResources]);

  const categoryOptions = useMemo(() => {
    const categories = [...new Set(resources.map(resource => resource.category))];
    return categories.map(category => ({
      value: category,
      label: category
    }));
  }, [resources]);

  const ResourceCard = ({ item }: { item: Resource }) => {
    return (
      <div className="p-4 bg-tv-bg-secondary border border-tv-border rounded-lg group relative">
        <div className="absolute top-4 right-4">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
            <button
              onClick={() => setEditingResource(item)}
              className="p-1 text-tv-text-secondary hover:text-tv-blue"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteResource(item)}
              className="p-1 text-tv-text-secondary hover:text-tv-red"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3 className="font-medium text-tv-blue">{item.name}</h3>
          <p className="text-sm text-tv-text-primary mt-2">{item.description}</p>
        </a>
      </div>
    );
  };

  const CategorySection = ({ title, icon: Icon, items }: { 
    title: string; 
    icon: React.ElementType; 
    items: Resource[];
  }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-6 h-6 text-tv-blue" />
        <h2 className="text-xl font-semibold text-tv-text-primary">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <ResourceCard key={index} item={item} />
        ))}
      </div>
    </div>
  );

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'Trading Brokers': return Building2;
      case 'Learning Platforms': return GraduationCap;
      case 'Market Analysis & News': return LineChart;
      case 'Economic Calendars': return Calendar;
      case 'Trading Communities': return Users;
      case 'Trading Tools & Calculators': return Calculator;
      case 'Educational Resources': return BookOpen;
      case 'Miscellaneous Tools': return Tool;
      default: return LineChart;
    }
  };

  return (
    <div className={`min-h-screen bg-tv-bg-primary ${isDarkMode ? 'dark' : ''} dark-mode-transition`}>
      <StickyHeader title="Trading Resources">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {marketOptions.map(market => (
                <button
                  key={market.value}
                  onClick={() => {
                    setSelectedMarket(market.value as MarketType);
                    setSelectedCategory(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedMarket === market.value
                      ? 'bg-tv-blue text-white'
                      : 'bg-tv-bg-secondary text-tv-text-secondary hover:text-tv-text-primary border border-tv-border'
                  }`}
                >
                  <market.icon className="w-5 h-5" />
                  <span>{market.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
              Add Resource
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-tv-text-secondary" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
              />
            </div>
            <div className="w-64">
              <Select
                options={categoryOptions}
                value={categoryOptions.find(option => option.value === selectedCategory)}
                onChange={(option) => setSelectedCategory(option?.value || null)}
                isClearable
                placeholder="Filter by category"
                className="text-sm"
                classNames={{
                  control: () => 'bg-tv-bg-secondary border-tv-border rounded-lg text-tv-text-primary'
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
              />
            </div>
          </div>
        </div>
      </StickyHeader>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-40">
        <div className="space-y-8">
          {Object.entries(groupedResources).map(([category, items]) => (
            <CategorySection 
              key={category}
              title={category} 
              icon={getIconForCategory(category)} 
              items={items} 
            />
          ))}
          {Object.keys(groupedResources).length === 0 && (
            <div className="text-center py-8 text-tv-text-secondary">
              No resources found matching your search criteria
            </div>
          )}
        </div>
      </main>

      {showAddForm && (
        <AddResourceForm
          onAdd={handleAddResource}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editingResource && (
        <EditResourceForm
          resource={editingResource}
          onSave={handleEditResource}
          onClose={() => setEditingResource(null)}
        />
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, Star, Plus, Edit2, Trash2, Search, DollarSign, BarChart3, Coins, Gem } from 'lucide-react';
import { Book, MarketType } from '../types/markets';
import { AddBookForm } from './AddBookForm';
import { EditBookForm } from './EditBookForm';
import { useTheme } from '../hooks/useTheme';
import { StickyHeader } from './StickyHeader';

const marketInfo = {
  forex: {
    name: 'Forex',
    icon: DollarSign,
    description: 'Foreign Exchange Market Books'
  },
  stocks: {
    name: 'Stocks',
    icon: BarChart3,
    description: 'Stock Market Trading Books'
  },
  crypto: {
    name: 'Cryptocurrency',
    icon: Coins,
    description: 'Cryptocurrency Trading Books'
  },
  commodities: {
    name: 'Commodities',
    icon: Gem,
    description: 'Commodities Trading Books'
  }
} as const;

export function TradingBooks() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('forex');
  const [minRating, setMinRating] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const marketOptions = [
    { value: 'forex', label: 'Forex' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'commodities', label: 'Commodities' }
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4, label: '4+ Stars' },
    { value: 4.5, label: '4.5+ Stars' },
    { value: 5, label: '5 Stars Only' }
  ];

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [...prev, newBook]);
    setShowAddForm(false);
  };

  const handleEditBook = (updatedBook: Book) => {
    setBooks(prev => prev.map(book => 
      book.name === updatedBook.name ? updatedBook : book
    ));
    setEditingBook(null);
  };

  const handleDeleteBook = (bookToDelete: Book) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => prev.filter(book => book.name !== bookToDelete.name));
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.topics?.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMarket = book.market === selectedMarket;
    const matchesRating = book.rating >= minRating;

    return matchesSearch && matchesMarket && matchesRating;
  });

  return (
    <div className={`min-h-screen bg-tv-bg-primary ${isDarkMode ? 'dark' : ''} dark-mode-transition`}>
      <StickyHeader title="Trading Books">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {Object.entries(marketInfo).map(([market, info]) => (
                <button
                  key={market}
                  onClick={() => setSelectedMarket(market as MarketType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedMarket === market
                      ? 'bg-tv-blue text-white'
                      : 'bg-tv-bg-secondary text-tv-text-secondary hover:text-tv-text-primary border border-tv-border'
                  }`}
                >
                  <info.icon className="w-5 h-5" />
                  <span>{info.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-tv-green text-white rounded-lg hover:opacity-90"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-tv-text-secondary" />
              <input
                type="text"
                placeholder="Search books by title, author, description, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-tv-bg-secondary border border-tv-border rounded-lg text-tv-text-primary focus:outline-none focus:border-tv-blue"
              />
            </div>
            <div className="w-48">
              <Select
                options={ratingOptions}
                onChange={(option) => setMinRating(option?.value || 0)}
                defaultValue={ratingOptions[0]}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBooks.map((book, index) => (
            <div
              key={index}
              className="relative p-4 bg-tv-bg-secondary border border-tv-border rounded-lg group"
            >
              <div className="absolute top-4 right-4">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={() => setEditingBook(book)}
                    className="p-1 text-tv-text-secondary hover:text-tv-blue"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book)}
                    className="p-1 text-tv-text-secondary hover:text-tv-red"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <a
                href={book.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-tv-blue pr-8">{book.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-tv-text-secondary">{book.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-tv-text-secondary mt-1">by {book.author}</p>
                <p className="text-sm text-tv-text-primary mt-2">{book.description}</p>
                {book.topics && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {book.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-tv-bg-primary text-tv-blue rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-8 text-tv-text-secondary">
            No books found matching your search criteria
          </div>
        )}
      </main>

      {showAddForm && (
        <AddBookForm
          market={selectedMarket}
          onAdd={handleAddBook}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editingBook && (
        <EditBookForm
          book={editingBook}
          onSave={handleEditBook}
          onClose={() => setEditingBook(null)}
        />
      )}
    </div>
  );
}
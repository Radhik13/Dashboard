import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { ArrowLeft, Star, Library, Plus, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Book, MarketType } from '../types/markets';
import { AddBookForm } from '../components/AddBookForm';
import { EditBookForm } from '../components/EditBookForm';

export function BooksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<MarketType>('forex');
  const [minRating, setMinRating] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [books, setBooks] = useState<Record<MarketType, Book[]>>(() => {
    const savedBooks = localStorage.getItem('tradingBooks');
    if (savedBooks) {
      return JSON.parse(savedBooks);
    }
    
    // Initialize with default books
    return {
      forex: [
        {
          name: "A Beginner's Guide to Forex Trading",
          author: "James Stuart",
          url: "https://www.amazon.com/s?k=beginners+guide+to+forex+trading",
          description: "Step-by-step guide to getting started with forex trading, including technical analysis and risk management",
          category: "Trading Books",
          rating: 4.5,
          market: 'forex',
          topics: ["Technical Analysis", "Risk Management"]
        },
        {
          name: "Day Trading and Swing Trading the Currency Market",
          author: "Kathy Lien",
          url: "https://www.amazon.com/Day-Trading-Swing-Currency-Market/dp/0471727407",
          description: "Practical day trading and swing trading strategies for the forex market",
          category: "Trading Books",
          rating: 4.3,
          market: 'forex',
          topics: ["Day Trading", "Swing Trading"]
        }
      ],
      stocks: [
        {
          name: "The Intelligent Investor",
          author: "Benjamin Graham",
          url: "https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661",
          description: "The definitive book on value investing and long-term investment strategy",
          category: "Trading Books",
          rating: 4.9,
          market: 'stocks',
          topics: ["Value Investing", "Investment Strategy"]
        }
      ],
      crypto: [
        {
          name: "Mastering Bitcoin",
          author: "Andreas M. Antonopoulos",
          url: "https://www.amazon.com/Mastering-Bitcoin-Programming-Open-Blockchain/dp/1491954388",
          description: "Programming the Open Blockchain - A comprehensive technical guide to Bitcoin",
          category: "Trading Books",
          rating: 4.8,
          market: 'crypto',
          topics: ["Bitcoin", "Blockchain"]
        }
      ],
      commodities: [
        {
          name: "Hot Commodities",
          author: "Jim Rogers",
          url: "https://www.amazon.com/Hot-Commodities-Anyone-Invest-Profitably/dp/0812973712",
          description: "How Anyone Can Invest Profitably in the World's Best Market",
          category: "Trading Books",
          rating: 4.5,
          market: 'commodities',
          topics: ["Commodity Trading", "Investment"]
        }
      ],
      tools: [],
      misc: []
    };
  });

  useEffect(() => {
    localStorage.setItem('tradingBooks', JSON.stringify(books));
  }, [books]);

  const marketOptions = [
    { value: 'forex', label: 'Forex' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'commodities', label: 'Commodities' },
    { value: 'misc', label: 'Miscellaneous' }
  ];

  const ratingOptions = [
    { value: 0, label: 'All Ratings' },
    { value: 4, label: '4+ Stars' },
    { value: 4.5, label: '4.5+ Stars' },
    { value: 5, label: '5 Stars Only' }
  ];

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => ({
      ...prev,
      [selectedMarket]: [...prev[selectedMarket], newBook]
    }));
  };

  const handleEditBook = (updatedBook: Book) => {
    setBooks(prev => ({
      ...prev,
      [selectedMarket]: prev[selectedMarket].map(book => 
        book.name === updatedBook.name ? updatedBook : book
      )
    }));
    setEditingBook(null);
  };

  const handleDeleteBook = (bookToDelete: Book) => {
    if (confirm('Are you sure you want to delete this book?')) {
      setBooks(prev => ({
        ...prev,
        [selectedMarket]: prev[selectedMarket].filter(book => book.name !== bookToDelete.name)
      }));
    }
  };

  const filteredBooks = books[selectedMarket]?.filter(book => {
    const matchesSearch = 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = book.rating >= minRating;

    return matchesSearch && matchesRating;
  }) || [];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Trading Books</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              {marketOptions.map(market => (
                <button
                  key={market.value}
                  onClick={() => setSelectedMarket(market.value as MarketType)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedMarket === market.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {market.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search books by title, author, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="w-48">
              <Select
                options={ratingOptions}
                onChange={(option) => setMinRating(option?.value || 0)}
                defaultValue={ratingOptions[0]}
                className="text-sm"
                classNames={{
                  control: () => 'border rounded-lg'
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book, index) => (
              <div
                key={index}
                className="relative p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="absolute top-4 right-4">
                  <div className="relative">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="p-1 text-gray-600 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book)}
                        className="p-1 text-gray-600 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <a
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-blue-600 pr-8">{book.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{book.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">by {book.author}</p>
                  <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                  {book.topics && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {book.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full"
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
            <div className="text-center py-8 text-gray-500">
              No books found matching your search criteria
            </div>
          )}
        </div>
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
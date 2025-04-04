import React, { useState } from 'react';
import { Book, MarketType } from '../types/markets';

interface AddBookFormProps {
  market: MarketType;
  onAdd: (book: Book) => void;
  onClose: () => void;
}

export function AddBookForm({ market, onAdd, onClose }: AddBookFormProps) {
  const [newBook, setNewBook] = useState<Partial<Book>>({
    market,
    rating: 4.0,
    topics: []
  });

  const [topicInput, setTopicInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBook.name && newBook.author && newBook.description && newBook.url) {
      onAdd({
        ...newBook,
        category: 'Trading Books',
        market,
      } as Book);
      onClose();
    }
  };

  const addTopic = () => {
    if (topicInput && !newBook.topics?.includes(topicInput)) {
      setNewBook(prev => ({
        ...prev,
        topics: [...(prev.topics || []), topicInput]
      }));
      setTopicInput('');
    }
  };

  const removeTopic = (topic: string) => {
    setNewBook(prev => ({
      ...prev,
      topics: prev.topics?.filter(t => t !== topic)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Add New Book</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Title
            </label>
            <input
              type="text"
              value={newBook.name || ''}
              onChange={(e) => setNewBook({ ...newBook, name: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={newBook.author || ''}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL (Amazon or other book store link)
            </label>
            <input
              type="url"
              value={newBook.url || ''}
              onChange={(e) => setNewBook({ ...newBook, url: e.target.value })}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={newBook.description || ''}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
              className="w-full p-2 border rounded-lg"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating (1-5)
            </label>
            <input
              type="number"
              value={newBook.rating || 4.0}
              onChange={(e) => setNewBook({ ...newBook, rating: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-lg"
              min="1"
              max="5"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topics
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="flex-1 p-2 border rounded-lg"
                placeholder="Add a topic"
              />
              <button
                type="button"
                onClick={addTopic}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newBook.topics?.map((topic, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                >
                  {topic}
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="text-blue-400 hover:text-blue-600"
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
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
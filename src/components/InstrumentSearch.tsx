import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Instrument, MarketType } from '../types/calculator';
import { useInstruments } from '../hooks/useInstruments';

interface InstrumentSearchProps {
  marketType: MarketType;
  value: string;
  onChange: (instrument: Instrument) => void;
  className?: string;
}

export function InstrumentSearch({ marketType, value, onChange, className = '' }: InstrumentSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { instruments, searchInstruments } = useInstruments(marketType);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredInstruments = searchTerm
    ? searchInstruments(searchTerm)
    : instruments;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={`Search ${marketType} instruments...`}
          className="w-full p-2 pr-10 bg-tv-bg-primary border border-tv-border rounded-lg text-tv-text-primary placeholder-tv-text-secondary focus:outline-none focus:border-tv-blue"
        />
        <Search className="absolute right-3 top-2.5 w-5 h-5 text-tv-text-secondary" />
      </div>
      
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-tv-bg-primary border border-tv-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredInstruments.map((instrument) => (
            <button
              key={instrument.symbol}
              className="w-full px-4 py-2 text-left hover:bg-tv-bg-secondary focus:bg-tv-bg-secondary"
              onClick={() => {
                onChange(instrument);
                setSearchTerm(instrument.symbol);
                setShowSuggestions(false);
              }}
            >
              <div className="font-medium text-tv-text-primary">{instrument.symbol}</div>
              <div className="text-sm text-tv-text-secondary">{instrument.name}</div>
            </button>
          ))}
          {filteredInstruments.length === 0 && (
            <div className="px-4 py-2 text-tv-text-secondary">
              No instruments found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
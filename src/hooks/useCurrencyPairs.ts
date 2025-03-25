import { useState, useEffect } from 'react';
import { CurrencyPair } from '../types/forex';

export function useCurrencyPairs() {
  const [pairs, setPairs] = useState<CurrencyPair[]>([
    // Major Pairs
    { 
      symbol: 'EUR/USD', 
      name: 'Euro / US Dollar', 
      category: 'major', 
      nickname: 'Fiber',
      bid: 1.0921, 
      ask: 1.0923 
    },
    { 
      symbol: 'USD/JPY', 
      name: 'US Dollar / Japanese Yen', 
      category: 'major', 
      nickname: 'Gopher',
      bid: 149.31, 
      ask: 149.33 
    },
    { 
      symbol: 'GBP/USD', 
      name: 'British Pound / US Dollar', 
      category: 'major', 
      nickname: 'Cable',
      bid: 1.2651, 
      ask: 1.2653 
    },
    { 
      symbol: 'USD/CHF', 
      name: 'US Dollar / Swiss Franc', 
      category: 'major', 
      nickname: 'Swissie',
      bid: 0.8821, 
      ask: 0.8823 
    },
    { 
      symbol: 'AUD/USD', 
      name: 'Australian Dollar / US Dollar', 
      category: 'major', 
      nickname: 'Aussie',
      bid: 0.6551, 
      ask: 0.6553 
    },
    { 
      symbol: 'USD/CAD', 
      name: 'US Dollar / Canadian Dollar', 
      category: 'major', 
      nickname: 'Loonie',
      bid: 1.3481, 
      ask: 1.3483 
    },
    { 
      symbol: 'NZD/USD', 
      name: 'New Zealand Dollar / US Dollar', 
      category: 'major', 
      nickname: 'Kiwi',
      bid: 0.6121, 
      ask: 0.6123 
    },
    { 
      symbol: 'GBP/EUR', 
      name: 'British Pound / Euro', 
      category: 'major', 
      nickname: 'Chunnel',
      bid: 0.8631, 
      ask: 0.8633 
    },
    { 
      symbol: 'EUR/CHF', 
      name: 'Euro / Swiss Franc', 
      category: 'major', 
      nickname: 'Euro-swissie',
      bid: 0.9521, 
      ask: 0.9523 
    },
    { 
      symbol: 'EUR/JPY', 
      name: 'Euro / Japanese Yen', 
      category: 'major', 
      nickname: 'Yuppy',
      bid: 163.07, 
      ask: 163.09 
    },

    // Minor Pairs
    { symbol: 'EUR/GBP', name: 'Euro / British Pound', category: 'minor', bid: 0.8631, ask: 0.8633 },
    { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen', category: 'minor', bid: 188.91, ask: 188.93 },
    { symbol: 'GBP/CHF', name: 'British Pound / Swiss Franc', category: 'minor', bid: 1.1161, ask: 1.1163 },
    { symbol: 'AUD/JPY', name: 'Australian Dollar / Japanese Yen', category: 'minor', bid: 97.81, ask: 97.83 },
    { symbol: 'AUD/CHF', name: 'Australian Dollar / Swiss Franc', category: 'minor', bid: 0.5781, ask: 0.5783 },
    { symbol: 'NZD/JPY', name: 'New Zealand Dollar / Japanese Yen', category: 'minor', bid: 91.41, ask: 91.43 },
    { symbol: 'NZD/CHF', name: 'New Zealand Dollar / Swiss Franc', category: 'minor', bid: 0.5401, ask: 0.5403 },

    // Exotic Pairs
    { symbol: 'USD/TRY', name: 'US Dollar / Turkish Lira', category: 'exotic', bid: 31.921, ask: 31.941 },
    { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', category: 'exotic', bid: 18.921, ask: 18.941 },
    { symbol: 'USD/SGD', name: 'US Dollar / Singapore Dollar', category: 'exotic', bid: 1.3421, ask: 1.3423 },
    { symbol: 'USD/MXN', name: 'US Dollar / Mexican Peso', category: 'exotic', bid: 17.121, ask: 17.141 },
    { symbol: 'USD/BRL', name: 'US Dollar / Brazilian Real', category: 'exotic', bid: 4.9821, ask: 4.9841 },
    { symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', category: 'exotic', bid: 82.921, ask: 82.941 },
  ]);

  useEffect(() => {
    // Simulate price updates
    const interval = setInterval(() => {
      setPairs((prevPairs) =>
        prevPairs.map((pair) => ({
          ...pair,
          bid: pair.bid! + (Math.random() - 0.5) * 0.0010,
          ask: pair.ask! + (Math.random() - 0.5) * 0.0010,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return pairs;
}
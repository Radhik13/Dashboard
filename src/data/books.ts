import { Book } from '../types/markets';

export const books: Record<string, Book[]> = {
  forex: [
    {
      name: "Currency Trading for Dummies",
      author: "Brian Dolan",
      url: "https://www.amazon.com/Currency-Trading-Dummies-Brian-Dolan/dp/1118989791",
      description: "A comprehensive guide to forex trading for beginners and advanced traders.",
      category: "Trading Books",
      market: "forex",
      rating: 4.5,
      topics: ["Technical Analysis", "Risk Management", "Trading Psychology"]
    },
    {
      name: "The Little Book of Currency Trading",
      author: "Kathy Lien",
      url: "https://www.amazon.com/Little-Book-Currency-Trading-Profits/dp/047077035X",
      description: "Learn the basics of currency trading with easy-to-understand tips and strategies.",
      category: "Trading Books",
      market: "forex",
      rating: 4.7,
      topics: ["Fundamentals", "Trading Strategy"]
    },
    {
      name: "Japanese Candlestick Charting Techniques",
      author: "Steve Nison",
      url: "https://www.amazon.com/Japanese-Candlestick-Charting-Techniques-Contemporary/dp/0735201811",
      description: "A comprehensive guide to understanding and using Japanese candlestick patterns.",
      category: "Trading Books",
      market: "forex",
      rating: 4.8,
      topics: ["Technical Analysis", "Chart Patterns"]
    }
  ],
  stocks: [
    {
      name: "The Intelligent Investor",
      author: "Benjamin Graham",
      url: "https://www.amazon.com/Intelligent-Investor-Definitive-Investing-Essentials/dp/0060555661",
      description: "The definitive book on value investing and long-term investment strategy.",
      category: "Trading Books",
      market: "stocks",
      rating: 4.9,
      topics: ["Value Investing", "Risk Management"]
    },
    {
      name: "One Up On Wall Street",
      author: "Peter Lynch",
      url: "https://www.amazon.com/One-Up-Wall-Street-Already/dp/0743200403",
      description: "How to use what you already know to make money in the market.",
      category: "Trading Books",
      market: "stocks",
      rating: 4.7,
      topics: ["Stock Analysis", "Investment Strategy"]
    },
    {
      name: "Technical Analysis of the Financial Markets",
      author: "John J. Murphy",
      url: "https://www.amazon.com/Technical-Analysis-Financial-Markets-Comprehensive/dp/0735200661",
      description: "A comprehensive guide to trading the financial markets using technical analysis.",
      category: "Trading Books",
      market: "stocks",
      rating: 4.8,
      topics: ["Technical Analysis", "Chart Patterns"]
    }
  ],
  crypto: [
    {
      name: "Mastering Bitcoin",
      author: "Andreas M. Antonopoulos",
      url: "https://www.amazon.com/Mastering-Bitcoin-Programming-Open-Blockchain/dp/1491954388",
      description: "Programming the Open Blockchain - A comprehensive technical guide to Bitcoin.",
      category: "Trading Books",
      market: "crypto",
      rating: 4.8,
      topics: ["Bitcoin", "Blockchain Technology"]
    },
    {
      name: "The Bitcoin Standard",
      author: "Saifedean Ammous",
      url: "https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861",
      description: "The decentralized alternative to central banking.",
      category: "Trading Books",
      market: "crypto",
      rating: 4.7,
      topics: ["Bitcoin", "Economics"]
    },
    {
      name: "Cryptoassets",
      author: "Chris Burniske",
      url: "https://www.amazon.com/Cryptoassets-Innovative-Investors-Bitcoin-Beyond/dp/1260026671",
      description: "The Innovative Investor's Guide to Bitcoin and Beyond.",
      category: "Trading Books",
      market: "crypto",
      rating: 4.6,
      topics: ["Cryptocurrency", "Investment Strategy"]
    }
  ],
  commodities: [
    {
      name: "Hot Commodities",
      author: "Jim Rogers",
      url: "https://www.amazon.com/Hot-Commodities-Anyone-Invest-Profitably/dp/0812973712",
      description: "How Anyone Can Invest Profitably in the World's Best Market.",
      category: "Trading Books",
      market: "commodities",
      rating: 4.5,
      topics: ["Commodity Trading", "Investment Strategy"]
    },
    {
      name: "The New Case for Gold",
      author: "James Rickards",
      url: "https://www.amazon.com/New-Case-Gold-James-Rickards/dp/1101980761",
      description: "Why gold is still a smart investment in the modern economy.",
      category: "Trading Books",
      market: "commodities",
      rating: 4.6,
      topics: ["Gold", "Precious Metals"]
    },
    {
      name: "A Trader's First Book on Commodities",
      author: "Carley Garner",
      url: "https://www.amazon.com/Traders-First-Book-Commodities-Introduction/dp/0134021339",
      description: "An introduction to the world's fastest growing market.",
      category: "Trading Books",
      market: "commodities",
      rating: 4.7,
      topics: ["Commodity Trading", "Futures Markets"]
    }
  ]
};
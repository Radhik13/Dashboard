import { Resource } from '../types/markets';

export const resources = {
  brokers: [
    {
      name: 'Interactive Brokers',
      url: 'https://www.interactivebrokers.com',
      description: 'Online brokerage for trading stocks, forex, and options',
      category: 'Trading Brokers',
      market: 'forex'
    }
  ],
  learning: [
    {
      name: 'Babypips School of Pipsology',
      url: 'https://www.babypips.com/learn/forex',
      description: 'Free, comprehensive forex trading course for beginners',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'Trading View Educational Videos',
      url: 'https://www.tradingview.com/education/',
      description: 'Technical analysis and trading strategy tutorials',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'Forex Factory University',
      url: 'https://www.forexfactory.com/university',
      description: 'Advanced trading concepts and strategies',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'Mind Luster',
      url: 'https://www.mindluster.com',
      description: 'Free online courses with certificates',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'Class Central',
      url: 'https://www.classcentral.com',
      description: 'Aggregator of free online courses and MOOCs',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'Learn Anything',
      url: 'https://learn-anything.xyz',
      description: 'Curated learning maps for various topics',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'Interactive Brokers Campus',
      url: 'https://www.interactivebrokers.com/en/trading/education.php',
      description: 'Financial education and trading tutorials',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'IBKR Trading Course',
      url: 'https://www.interactivebrokers.com/en/trading/getting-started.php',
      description: 'IBKR training course for new traders',
      category: 'Learning Platforms',
      market: 'forex'
    },
    {
      name: 'Binance Academy',
      url: 'https://academy.binance.com',
      description: 'Free educational resources on cryptocurrency trading and blockchain',
      category: 'Learning Platforms',
      market: 'crypto'
    }
  ],
  analysis: [
    {
      name: 'TradingView',
      url: 'https://www.tradingview.com',
      description: 'Advanced charting and technical analysis platform',
      category: 'Market Analysis & News',
      market: 'forex'
    },
    {
      name: 'Forex Factory News',
      url: 'https://www.forexfactory.com/news',
      description: 'Real-time forex news and market analysis',
      category: 'Market Analysis & News',
      market: 'forex'
    },
    {
      name: 'DailyFX',
      url: 'https://www.dailyfx.com',
      description: 'Market analysis, forecasts, and trading strategies',
      category: 'Market Analysis & News',
      market: 'forex'
    },
    {
      name: 'FINVIZ',
      url: 'https://finviz.com',
      description: 'Stock screener and financial visualization platform',
      category: 'Market Analysis & News',
      market: 'stocks'
    },
    {
      name: 'Nasdaq',
      url: 'https://www.nasdaq.com',
      description: 'Stock market updates, news, and data',
      category: 'Market Analysis & News',
      market: 'stocks'
    },
    {
      name: 'NYSE',
      url: 'https://www.nyse.com',
      description: 'Official site of the NYSE for stock trading data and news',
      category: 'Market Analysis & News',
      market: 'stocks'
    },
    {
      name: 'StockCharts',
      url: 'https://stockcharts.com',
      description: 'Advanced charting and analysis for stocks and markets',
      category: 'Market Analysis & News',
      market: 'stocks'
    },
    {
      name: 'Investing.com',
      url: 'https://www.investing.com',
      description: 'Stock market quotes, charts, and financial news',
      category: 'Market Analysis & News',
      market: 'stocks'
    },
    {
      name: 'Reuters',
      url: 'https://www.reuters.com',
      description: 'Global financial and economic news',
      category: 'Market Analysis & News',
      market: 'stocks'
    },
    {
      name: 'CoinMarketCap',
      url: 'https://coinmarketcap.com',
      description: 'Comprehensive cryptocurrency market data platform',
      category: 'Market Analysis & News',
      market: 'crypto'
    },
    {
      name: 'CryptoCompare',
      url: 'https://www.cryptocompare.com',
      description: 'Cryptocurrency market data, news, and analysis tools',
      category: 'Market Analysis & News',
      market: 'crypto'
    },
    {
      name: 'CoinGecko',
      url: 'https://www.coingecko.com',
      description: 'Cryptocurrency data aggregator tracking over 6,000 coins',
      category: 'Market Analysis & News',
      market: 'crypto'
    },
    {
      name: 'The Block',
      url: 'https://www.theblock.co',
      description: 'In-depth news, research, and analysis on the cryptocurrency industry',
      category: 'Market Analysis & News',
      market: 'crypto'
    },
    {
      name: 'Messari',
      url: 'https://messari.io',
      description: 'Crypto market intelligence and analysis with research reports',
      category: 'Market Analysis & News',
      market: 'crypto'
    },
    {
      name: 'Trading Economics - Commodities',
      url: 'https://tradingeconomics.com/commodities',
      description: 'Real-time data, charts, and forecasts for commodity markets',
      category: 'Market Analysis & News',
      market: 'commodities'
    },
    {
      name: 'Kitco',
      url: 'https://www.kitco.com',
      description: 'Leading precious metals resource with live spot prices and analysis',
      category: 'Market Analysis & News',
      market: 'commodities'
    },
    {
      name: 'Barchart - Commodities',
      url: 'https://www.barchart.com/futures/commodities',
      description: 'Tools for analyzing commodity futures markets and price data',
      category: 'Market Analysis & News',
      market: 'commodities'
    },
    {
      name: 'CME Group Commodities',
      url: 'https://www.cmegroup.com/markets/commodities.html',
      description: 'Information about futures and options contracts on various commodities',
      category: 'Market Analysis & News',
      market: 'commodities'
    },
    {
      name: 'The Oil Price',
      url: 'https://oilprice.com',
      description: 'News, analysis, and pricing data on the global oil market',
      category: 'Market Analysis & News',
      market: 'commodities'
    },
    {
      name: 'GoldSilver',
      url: 'https://goldsilver.com',
      description: 'Market data and resources on investing in precious metals',
      category: 'Market Analysis & News',
      market: 'commodities'
    },
    {
      name: 'AgWeb',
      url: 'https://www.agweb.com',
      description: 'News and resources for agricultural commodities',
      category: 'Market Analysis & News',
      market: 'commodities'
    }
  ],
  calendar: [
    {
      name: 'Forex Factory Calendar',
      url: 'https://www.forexfactory.com/calendar',
      description: 'Comprehensive economic calendar with impact ratings',
      category: 'Economic Calendars',
      market: 'forex'
    },
    {
      name: 'Investing.com Economic Calendar',
      url: 'https://www.investing.com/economic-calendar/',
      description: 'Real-time economic events and forecasts',
      category: 'Economic Calendars',
      market: 'forex'
    },
    {
      name: 'TradingView Economic Calendar',
      url: 'https://www.tradingview.com/economic-calendar/',
      description: 'Economic calendar with market impact analysis',
      category: 'Economic Calendars',
      market: 'forex'
    },
    {
      name: 'Forex Market Hours',
      url: 'https://www.forexmarkethours.com',
      description: 'Forex market time converter and trading sessions',
      category: 'Economic Calendars',
      market: 'forex'
    }
  ],
  community: [
    {
      name: 'r/Forex',
      url: 'https://www.reddit.com/r/Forex/',
      description: 'Active forex trading community on Reddit',
      category: 'Trading Communities',
      market: 'forex'
    },
    {
      name: 'BabyPips Forum',
      url: 'https://forums.babypips.com/',
      description: 'Friendly community for forex traders of all levels',
      category: 'Trading Communities',
      market: 'forex'
    },
    {
      name: 'Forex Factory Forum',
      url: 'https://www.forexfactory.com/forum',
      description: 'Large forex community with trading discussions',
      category: 'Trading Communities',
      market: 'forex'
    },
    {
      name: 'r/CryptoCurrency',
      url: 'https://www.reddit.com/r/CryptoCurrency/',
      description: 'Large cryptocurrency community on Reddit',
      category: 'Trading Communities',
      market: 'crypto'
    },
    {
      name: 'BitcoinTalk',
      url: 'https://bitcointalk.org',
      description: 'Original Bitcoin forum and cryptocurrency discussion platform',
      category: 'Trading Communities',
      market: 'crypto'
    }
  ],
  tools: [
    {
      name: 'Myfxbook Calculator',
      url: 'https://www.myfxbook.com/forex-calculators',
      description: 'Suite of forex trading calculators',
      category: 'Trading Tools & Calculators',
      market: 'forex'
    },
    {
      name: 'Currency Strength Meter',
      url: 'https://www.tradingview.com/markets/currencies/forex-strength-meter/',
      description: 'Real-time currency strength analysis',
      category: 'Trading Tools & Calculators',
      market: 'forex'
    },
    {
      name: 'Position Size Calculator',
      url: 'https://www.babypips.com/tools/position-size-calculator',
      description: 'Risk-based position sizing calculator',
      category: 'Trading Tools & Calculators',
      market: 'forex'
    },
    {
      name: 'Autochartist',
      url: 'https://www.autochartist.com',
      description: 'Automated pattern recognition tool for trading analysis',
      category: 'Trading Tools & Calculators',
      market: 'forex'
    },
    {
      name: 'Pair Trading Lab',
      url: 'https://www.pairtradinglab.com',
      description: 'Platform for pair trading strategy analysis',
      category: 'Trading Tools & Calculators',
      market: 'forex'
    },
    {
      name: 'TradingTerminal Scanner',
      url: 'https://www.tradingterminal.com',
      description: 'Market scanner for trading opportunities',
      category: 'Trading Tools & Calculators',
      market: 'forex'
    },
    {
      name: 'Finviz Stock Screener',
      url: 'https://finviz.com/screener.ashx',
      description: 'Advanced stock screening and visualization tool',
      category: 'Trading Tools & Calculators',
      market: 'stocks'
    },
    {
      name: 'Stock Options Calculator',
      url: 'https://www.optionsprofitcalculator.com',
      description: 'Options strategy and profit calculator',
      category: 'Trading Tools & Calculators',
      market: 'stocks'
    },
    {
      name: 'CryptoWatch',
      url: 'https://cryptowat.ch',
      description: 'Real-time cryptocurrency charts and trading platform',
      category: 'Trading Tools & Calculators',
      market: 'crypto'
    },
    {
      name: 'Blockchain Explorer',
      url: 'https://www.blockchain.com/explorer',
      description: 'Tool for exploring and analyzing blockchain transactions',
      category: 'Trading Tools & Calculators',
      market: 'crypto'
    },
    {
      name: 'Commodity Channel Index Calculator',
      url: 'https://www.barchart.com/tools/indicators/cci',
      description: 'Tool for calculating the Commodity Channel Index',
      category: 'Trading Tools & Calculators',
      market: 'commodities'
    },
    {
      name: 'Futures Calculator',
      url: 'https://www.cmegroup.com/tools-information/calculators.html',
      description: 'Calculator for futures contracts and margins',
      category: 'Trading Tools & Calculators',
      market: 'commodities'
    }
  ],
  education: [
    {
      name: 'Investopedia - Financial Terms',
      url: 'https://www.investopedia.com/financial-term-dictionary-4769738',
      description: 'Dictionary of financial and investing terms',
      category: 'Educational Resources',
      market: 'forex'
    },
    {
      name: 'Piranha Profits',
      url: 'https://www.piranhaprofits.com',
      description: 'Introduction to technical analysis',
      category: 'Educational Resources',
      market: 'forex'
    },
    {
      name: 'TrendSpider Learning Center',
      url: 'https://www.trendspider.com/learning-center',
      description: 'Resources for learning technical analysis and market trends',
      category: 'Educational Resources',
      market: 'forex'
    },
    {
      name: 'Price Action Trading Secrets',
      url: 'https://www.priceactiontradingsecrets.com',
      description: 'Bonus materials for price action trading strategies',
      category: 'Educational Resources',
      market: 'forex'
    },
    {
      name: 'Investopedia - Technical Analysis',
      url: 'https://www.investopedia.com/technical-analysis-4689657',
      description: 'Guide to technical analysis in investing',
      category: 'Educational Resources',
      market: 'forex'
    },
    {
      name: 'Investopedia - Stocks Analysis',
      url: 'https://www.investopedia.com/stock-analysis-4689653',
      description: 'Explanation of technical analysis for stocks and securities',
      category: 'Educational Resources',
      market: 'stocks'
    },
    {
      name: 'CME Group Education',
      url: 'https://www.cmegroup.com/education.html',
      description: 'Educational resources for commodities trading',
      category: 'Educational Resources',
      market: 'commodities'
    },
    {
      name: 'Commodity.com Learn',
      url: 'https://commodity.com/learn',
      description: 'Comprehensive guides to trading different commodities',
      category: 'Educational Resources',
      market: 'commodities'
    }
  ],
  misc: [
    {
      name: 'Aixploria',
      url: 'https://www.aixploria.com',
      description: 'Directory of AI tools across different categories',
      category: 'Miscellaneous Tools',
      market: 'misc'
    },
    {
      name: 'BugMeNot',
      url: 'http://bugmenot.com',
      description: 'Shared login credentials to bypass registrations',
      category: 'Miscellaneous Tools',
      market: 'misc'
    },
    {
      name: 'IG Australia - Level 2 Data',
      url: 'https://www.ig.com/au/level-2-data',
      description: 'Explanation of Level 2 market data and trading strategies',
      category: 'Miscellaneous Tools',
      market: 'misc'
    },
    {
      name: 'IG Australia - Spread',
      url: 'https://www.ig.com/au/trading-spreads',
      description: 'Definition and explanation of spread in trading',
      category: 'Miscellaneous Tools',
      market: 'misc'
    }
  ]
} as const;
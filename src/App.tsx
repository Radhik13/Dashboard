import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MarketStatus } from './components/MarketStatus';
import { CurrencyPairs } from './components/CurrencyPairs';
import { Calculator } from './components/Calculator';
import { QuickStats } from './components/QuickStats';
import { TradeJournal } from './pages/TradeJournal';
import { Resources } from './components/Resources';
import { TradingBooks } from './components/TradingBooks';
import { Notes } from './components/Notes';
import { EconomicCalendar } from './components/EconomicCalendar';
import { BacktestingLog } from './components/BacktestingLog';
import { TradingPsychologyPage } from './pages/TradingPsychologyPage';
import { PositionSizeCalculator } from './pages/PositionSizeCalculator';
import { Sidebar } from './components/Sidebar';
import { useTheme } from './hooks/useTheme';

function Dashboard() {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'dark' : ''} dark-mode-transition`}>
      <div className="space-y-6">
        <MarketStatus />
        <QuickStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrencyPairs />
          <EconomicCalendar />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobile={isMobile}
        />
        <main 
          className={`main-content ${
            sidebarCollapsed ? 'ml-sidebar-collapsed' : 'ml-sidebar-expanded'
          } ${isMobile ? 'ml-0' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/books" element={<TradingBooks />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/calendar" element={<EconomicCalendar />} />
              <Route path="/backtesting" element={<BacktestingLog />} />
              <Route path="/psychology" element={<TradingPsychologyPage />} />
              <Route path="/calculator" element={<PositionSizeCalculator />} />
              <Route path="/journal" element={<TradeJournal />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
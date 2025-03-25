import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Brain,
  LineChart,
  FileText,
  Library,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Calculator,
  BookOpen
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

export function Sidebar({ collapsed, onToggle, isMobile }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/calculator', icon: Calculator, label: 'Position Calculator' },
    { path: '/journal', icon: BookOpen, label: 'Trade Journal' },
    { path: '/psychology', icon: Brain, label: 'Psychology' },
    { path: '/backtesting', icon: LineChart, label: 'Backtesting' },
    { path: '/notes', icon: FileText, label: 'Notes' },
    { path: '/books', icon: Library, label: 'Trading Books' },
    { path: '/resources', icon: BookMarked, label: 'Resources' }
  ];

  return (
    <aside className={`sidebar scrollbar-custom ${collapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-tv-border">
          {!collapsed && (
            <h1 className="text-lg font-bold text-tv-text-primary truncate">
              Forex Trading
            </h1>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-tv-text-secondary hover:text-tv-text-primary hover:bg-tv-bg-primary transition-colors ${
                location.pathname === item.path ? 'text-tv-blue bg-tv-bg-primary' : ''
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="ml-3 truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-tv-border">
          <div className="flex items-center justify-between">
            {!collapsed && <ThemeToggle />}
            <button
              onClick={onToggle}
              className="p-2 text-tv-text-secondary hover:text-tv-text-primary rounded-lg"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
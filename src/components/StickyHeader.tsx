import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface StickyHeaderProps {
  title: string;
  children: React.ReactNode;
}

export function StickyHeader({ title, children }: StickyHeaderProps) {
  return (
    <div className="sticky-header">
      {/* Main Header */}
      <div className="bg-tv-bg-primary border-b border-tv-border">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-tv-text-secondary hover:text-tv-text-primary"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold text-tv-text-primary">{title}</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-tv-bg-primary border-b border-tv-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
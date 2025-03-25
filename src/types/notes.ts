import { JSONContent } from '@tiptap/react';

export interface Note {
  id: string;
  title: string;
  content: JSONContent;
  tags: string[];
  folder: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  versions?: {
    content: JSONContent;
    timestamp: string;
    version: number;
  }[];
  type?: 'trade' | 'strategy' | 'analysis' | 'journal';
  linkedTrades?: string[];
  linkedNotes?: string[];
  template?: string;
  metadata?: {
    pair?: string;
    timeframe?: string;
    tradeId?: string;
    strategy?: string;
    outcome?: 'win' | 'loss' | 'breakeven';
    rating?: number;
    keyPoints?: string[];
  };
}

export interface NoteFolder {
  id: string;
  name: string;
  color: string;
  parentId?: string;
  children?: NoteFolder[];
  isExpanded?: boolean;
}

export interface NoteTemplate {
  id: string;
  name: string;
  type: 'trade' | 'strategy' | 'analysis' | 'journal';
  content: JSONContent;
  sections: {
    title: string;
    type: 'text' | 'checklist' | 'rating' | 'pair' | 'timeframe';
    required?: boolean;
    options?: string[];
  }[];
}

export interface NoteFilter {
  folders: string[];
  tags: string[];
  dateRange?: [Date | null, Date | null];
  type?: 'trade' | 'strategy' | 'analysis' | 'journal';
  searchTerm?: string;
  showPinnedOnly?: boolean;
}

export interface NoteStats {
  totalNotes: number;
  byFolder: Record<string, number>;
  byTag: Record<string, number>;
  byType: Record<string, number>;
  recentlyModified: Note[];
  frequentTags: string[];
}

export interface NoteExportOptions {
  format: 'pdf' | 'html' | 'markdown' | 'json';
  includeMetadata: boolean;
  includeTags: boolean;
  includeVersions: boolean;
  dateRange?: [Date | null, Date | null];
  selectedNotes?: string[];
}

export interface NoteSortOptions {
  field: 'title' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

export interface NoteSearchResult {
  noteId: string;
  title: string;
  excerpt: string;
  matches: {
    field: string;
    text: string;
    position: number;
  }[];
  score: number;
}

export const DEFAULT_TEMPLATES: NoteTemplate[] = [
  {
    id: 'trade-journal',
    name: 'Trade Journal Entry',
    type: 'trade',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Trade Setup' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Entry Reason:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Risk Management:' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Trade Execution' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Entry Price:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Stop Loss:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Take Profit:' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Trade Review' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'What went well:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'What could be improved:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Lessons learned:' }]
        }
      ]
    },
    sections: [
      { title: 'Currency Pair', type: 'pair', required: true },
      { title: 'Timeframe', type: 'timeframe', required: true },
      { title: 'Trade Setup', type: 'text', required: true },
      { title: 'Pre-Trade Checklist', type: 'checklist', required: true, options: [
        'Checked economic calendar',
        'Identified key support/resistance levels',
        'Confirmed trend direction',
        'Calculated position size',
        'Set stop loss and take profit'
      ]},
      { title: 'Trade Outcome', type: 'rating', required: true }
    ]
  },
  {
    id: 'strategy-doc',
    name: 'Strategy Documentation',
    type: 'strategy',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Strategy Overview' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Description:' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Entry Rules' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Exit Rules' }]
        },
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '' }] }]
            }
          ]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Risk Management' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Position sizing:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Stop loss placement:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Take profit targets:' }]
        }
      ]
    },
    sections: [
      { title: 'Strategy Name', type: 'text', required: true },
      { title: 'Timeframes', type: 'timeframe', required: true },
      { title: 'Entry Rules', type: 'checklist', required: true },
      { title: 'Exit Rules', type: 'checklist', required: true },
      { title: 'Risk Management Rules', type: 'checklist', required: true }
    ]
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    type: 'analysis',
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Market Overview' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Current market conditions:' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Technical Analysis' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Key levels:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Trend analysis:' }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Fundamental Factors' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Economic events:' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Market sentiment:' }]
        }
      ]
    },
    sections: [
      { title: 'Currency Pair', type: 'pair', required: true },
      { title: 'Timeframe', type: 'timeframe', required: true },
      { title: 'Analysis Type', type: 'checklist', options: [
        'Technical Analysis',
        'Fundamental Analysis',
        'Sentiment Analysis',
        'Price Action'
      ]},
      { title: 'Key Levels', type: 'text', required: true }
    ]
  }
];
export type Mood = 'confident' | 'anxious' | 'hesitant' | 'greedy' | 'fearful' | 'focused' | 'calm' | 'other';

export interface PsychologyEntry {
  id: string;
  tradeId?: string;
  mood: Mood;
  customMood?: string;
  notes: string;
  timestamp: string;
  type: 'pre' | 'post';
  stressLevel: number;
  externalFactors: string[];
}

export interface MoodPattern {
  mood: Mood;
  winRate: number;
  totalTrades: number;
  averageProfit: number;
}
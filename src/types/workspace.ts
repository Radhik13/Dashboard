export interface WorkspaceLayout {
  id: string;
  name: string;
  description: string;
  components: {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    settings: Record<string, any>;
  }[];
  theme: {
    mode: 'light' | 'dark';
    accentColor: string;
    chartColors: string[];
  };
}

export interface ComponentSettings {
  visible: boolean;
  expanded: boolean;
  refreshInterval?: number;
  customColors?: Record<string, string>;
}

export interface ScreenTimeAlert {
  id: string;
  interval: number;
  message: string;
  enabled: boolean;
  lastTriggered?: string;
}

export interface VolatilityAlert {
  id: string;
  pair: string;
  threshold: number;
  condition: 'above' | 'below';
  enabled: boolean;
}
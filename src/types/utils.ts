export type TimeFormat = '12h' | '24h';
export type ClockType = 'analog' | 'digital' | 'hybrid';
export type AnimationType = 'smooth' | 'tick' | 'none';

export interface ClockMetadata {
  date: string;
  title: string;
  description: string;
  type: ClockType;
  hasCustomFont: boolean;
  requiresImages: boolean;
}

export interface ClockItem {
  date: string;
  path: string;
  title?: string;
  description?: string;
}

export interface DataContextType {
  items: ClockItem[];
  loading: boolean;
  error: string | null;
}

export interface FontLoadingResult {
  isLoaded: boolean;
  error: string | null;
  fontFamily: string;
}

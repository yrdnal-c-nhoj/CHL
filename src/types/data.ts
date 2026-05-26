export interface ClockItem {
  path: string;
  date: string;
  title: string;
  clockNumber?: number;
  tags?: string[];
}

export interface DataContextType {
  items: ClockItem[];
  loading: boolean;
  error: string | null;
}

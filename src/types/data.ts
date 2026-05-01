export interface ClockItem {
  path: string;
  date: string;
  title: string;
  clockNumber?: number;
}

export interface DataContextType {
  items: ClockItem[];
  loading: boolean;
  error: string | null;
}

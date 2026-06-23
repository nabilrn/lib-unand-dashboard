// Central type definitions for Visitor Dashboard
export type ConnectionStatus = 'connected' | 'connecting' | 'mock' | 'error';

export interface TodayVisitorsResponse { total: number; source: 'cache' | 'db'; }
export interface WeeklyVisitorsResponse { days: Array<{ date: string; total: number }>; }
export interface MonthlyVisitorsResponse { months: Array<{ month: string; total: number }>; }
export interface YearlyVisitorsResponse { years: Array<{ year: number; total: number }>; }
export interface TopVisitorsResponse { visitors: Array<{ member_id: string | null; member_name: string | null; institution: string | null; fakultas: string | null; total: number; }>; }
export interface TopFacultiesResponse { faculties: Array<{ institution: string | null; fakultas: string | null; total: number; }>; }
export interface BookStatsResponse { total_unique_titles: number; total_items: number; }
export interface TopBooksResponse { books: Array<{ biblio_id: number; title: string; total_loans: number; }>; }
// Updated to include new fields returned by backend (year, source, institution, fakultas)
export interface TopBorrowersResponse {
  year: number;
  source: string; // e.g. 'cache' | 'db' (backend may refine later)
  borrowers: Array<{
    member_id: string | number | null;
    member_name: string | null;
    institution: string | null;
    fakultas: string | null;
    total_loans: number;
  }>;
}

export interface ChartConfigBase {
  id: string;
  title: string;
  subtitle: string;
  type: 'events' | 'leaderboard' | 'line' | 'bar' | 'horizontalBar' | 'pie' | 'kpi' | 'radialBar' | 'area';
  subtype?: 'visitors' | 'borrowers';
  endpoint: string | null;
}
export interface ChartConfigData extends ChartConfigBase {
  type: Exclude<ChartConfigBase['type'], 'events'>;
  dataKey: string; // guaranteed at runtime
  xKey: string;
  formatter: (data: any) => any[];
}
export interface ChartConfigEvents extends ChartConfigBase {
  type: 'events';
  dataKey: null;
  xKey: null;
  formatter: (data: any) => any[]; // identity
}
export type ChartConfig = ChartConfigData | ChartConfigEvents;

export interface LoadedChartData {
  id: string;
  data: any[];
  lastUpdated: Date;
  source: 'api' | 'mock' | 'local';
  status: 'success' | 'failed';
  errorType?: string;
  errorMessage?: string;
}

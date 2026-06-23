export interface EventItem {
  id: number;
  title: string;
  location: string;
  // Frontend convenience fields (derived from starts_at if backend only sends starts_at)
  date?: string; // ISO date part (yyyy-mm-dd)
  time?: string; // HH:mm
  starts_at?: string;
  thumbnail_path?: string;
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  created_at?: string;
  updated_at?: string;
}

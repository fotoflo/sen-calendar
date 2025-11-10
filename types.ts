
export type ViewType = 'monthly' | 'weekly';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

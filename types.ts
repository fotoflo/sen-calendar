
export type ViewType = 'monthly' | 'weekly';

export type PaperSize = 'a4' | 'letter';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}
import React from 'react';
import { MonthlyView } from './MonthlyView';
import { WeeklyView } from './WeeklyView';
import { ViewType, CalendarEvent, PaperSize, WeeklyLayout } from '../types';

interface CalendarPreviewProps {
  viewType: ViewType;
  startDate: Date;
  printRange: number;
  logo: string | null;
  events: CalendarEvent[];
  addDate: (date: Date, amount: number) => Date;
  paperSize: PaperSize;
  weeklyLayout: WeeklyLayout;
}

export const CalendarPreview: React.FC<CalendarPreviewProps> = ({
  viewType,
  startDate,
  printRange,
  logo,
  events,
  addDate,
  paperSize,
  weeklyLayout,
}) => {
  return (
    <div id="preview-container" className="space-y-8 flex flex-col items-center">
      {[...Array(printRange).keys()].map((i) => {
        const pageDate = addDate(startDate, i);
        return (
          <div 
            key={i}
            className={`printable-calendar-page relative bg-paper-white rounded-sm p-12 flex flex-col ${viewType} ${paperSize}`}
          >
            {viewType === 'monthly' ? (
              <MonthlyView date={pageDate} events={events} />
            ) : (
              <WeeklyView date={pageDate} events={events} layout={weeklyLayout} />
            )}

            {logo && (
              <div className="absolute bottom-12 right-12 z-20">
                <img src={logo} alt="Logo" className="max-h-12 max-w-xs object-contain" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
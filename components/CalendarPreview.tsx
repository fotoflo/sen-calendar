import React from 'react';
import { MonthlyView } from './MonthlyView';
import { WeeklyView } from './WeeklyView';
import { ViewType, CalendarEvent } from '../types';

interface CalendarPreviewProps {
  viewType: ViewType;
  startDate: Date;
  printRange: number;
  logo: string | null;
  events: CalendarEvent[];
  addDate: (date: Date, amount: number) => Date;
}

export const CalendarPreview: React.FC<CalendarPreviewProps> = ({
  viewType,
  startDate,
  printRange,
  logo,
  events,
  addDate,
}) => {
  return (
    <div id="preview-container" className="space-y-8">
      {[...Array(printRange).keys()].map((i) => {
        const pageDate = addDate(startDate, i);
        return (
          <div 
            key={i}
            className="printable-calendar-page relative bg-paper-white shadow-lg rounded-sm aspect-[1.414/1] w-full max-w-4xl mx-auto p-8 md:p-12 flex flex-col"
            style={{
                boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.05)'
            }}
          >
            {viewType === 'monthly' ? (
              <MonthlyView date={pageDate} events={events} />
            ) : (
              <WeeklyView date={pageDate} events={events} />
            )}

            {logo && (
              <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20">
                <img src={logo} alt="Logo" className="max-h-12 max-w-xs object-contain" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
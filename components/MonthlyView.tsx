
import React from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay
} from 'date-fns';
import { CalendarEvent } from '../types';

interface MonthlyViewProps {
  date: Date;
  events: CalendarEvent[];
}

const DayCell: React.FC<{ day: Date; isCurrentMonth: boolean; events: CalendarEvent[] }> = ({ day, isCurrentMonth, events }) => {
  const dayEvents = events.filter(event => isSameDay(event.start, day));

  return (
    <div className={`border-t border-r border-gray-100 p-2 flex flex-col h-full ${isCurrentMonth ? '' : 'bg-gray-50'}`}>
      <span className={`self-end text-sm ${isCurrentMonth ? 'text-gray-600' : 'text-gray-400'}`}>
        {format(day, 'd')}
      </span>
      <div className="mt-1 space-y-1 overflow-y-auto">
        {dayEvents.map(event => (
            <div key={event.id} className="text-xs bg-gray-100 p-1 rounded-sm">
              {event.title}
            </div>
        ))}
      </div>
    </div>
  );
};

export const MonthlyView: React.FC<MonthlyViewProps> = ({ date, events }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-light text-gray-800 tracking-wide">{format(date, 'MMMM')}</h2>
        <h3 className="text-3xl font-light text-gray-400">{format(date, 'yyyy')}</h3>
      </div>
      <div className="grid grid-cols-7 flex-grow">
        {weekdays.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-muted py-2 border-b-2 border-gray-100">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <DayCell 
            key={day.toString()} 
            day={day}
            isCurrentMonth={isSameMonth(day, date)}
            events={events}
          />
        ))}
      </div>
    </div>
  );
};
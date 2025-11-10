
import React from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';
import { CalendarEvent } from '../types';

interface WeeklyViewProps {
  date: Date;
  events: CalendarEvent[];
}

const DayBox: React.FC<{ day: Date, events: CalendarEvent[] }> = ({ day, events }) => {
  const dayEvents = events.filter(event => isSameDay(event.start, day));

  return (
    <div className="p-3 flex flex-col h-full">
      <div className="text-center mb-2">
        <p className="text-sm text-muted">{format(day, 'EEE')}</p>
        <p className="text-2xl font-medium text-gray-700">{format(day, 'd')}</p>
      </div>
      <div className="mt-1 space-y-2 overflow-y-auto flex-grow border-t border-gray-100 pt-2">
         {dayEvents.map(event => (
            <div key={event.id} className="text-xs bg-gray-100 p-2 rounded-md">
              <p className="font-semibold">{event.title}</p>
              {!(event.start.getHours() === 0 && event.start.getMinutes() === 0) &&
                <p className="text-gray-500">{format(event.start, 'p')}</p>
              }
            </div>
          ))}
      </div>
    </div>
  );
};

export const WeeklyView: React.FC<WeeklyViewProps> = ({ date, events }) => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const topRowDays = days.slice(0, 3);
  const bottomRowDays = days.slice(3, 7);

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-3xl font-light text-gray-800 tracking-wide">
          Week of {format(weekStart, 'MMMM d')}
        </h2>
        <h3 className="text-3xl font-light text-gray-400">{format(date, 'yyyy')}</h3>
      </div>
      
      <div className="grid grid-rows-2 flex-grow border border-gray-200">
        <div className="grid grid-cols-3 border-b border-gray-200">
          {topRowDays.map((day, index) => (
            <div key={day.toString()} className={index < 2 ? 'border-r border-gray-200' : ''}>
              <DayBox day={day} events={events} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-4">
          {bottomRowDays.map((day, index) => (
            <div key={day.toString()} className={index < 3 ? 'border-r border-gray-200' : ''}>
              <DayBox day={day} events={events} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

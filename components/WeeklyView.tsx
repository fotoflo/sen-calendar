import React, { useState } from 'react';
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

type WeeklyLayout = 'weekdayFocus' | 'weekendFocus';

const DayBox: React.FC<{ day: Date, events: CalendarEvent[] }> = ({ day, events }) => {
  const dayEvents = events.filter(event => isSameDay(event.start, day));

  return (
    <div className="p-3 flex flex-col h-full">
      <div className="text-center mb-2">
        <p className="text-2xl font-medium text-gray-700 align-baseline">
          <span className="text-muted font-normal text-lg mr-1.5">{format(day, 'EEE')}</span>
          {format(day, 'd')}
        </p>
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
  const [layout, setLayout] = useState<WeeklyLayout>('weekdayFocus');

  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const isWeekdayFocus = layout === 'weekdayFocus';
  const splitIndex = isWeekdayFocus ? 3 : 4;
  
  const topRowDays = days.slice(0, splitIndex);
  const bottomRowDays = days.slice(splitIndex);

  const topRowCols = isWeekdayFocus ? 'grid-cols-3' : 'grid-cols-4';
  const bottomRowCols = isWeekdayFocus ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="flex flex-col flex-grow">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-3xl font-light text-gray-800 tracking-wide">
          Week of {format(weekStart, 'MMMM d')}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5 text-lg">
            <button
              onClick={() => setLayout('weekdayFocus')}
              className={`px-2 py-0.5 rounded-md transition-all ${layout === 'weekdayFocus' ? 'bg-white shadow-sm' : 'opacity-50 hover:opacity-100'}`}
              aria-label="Weekday Focus Layout"
              title="Weekday Focus Layout (3 days on top)"
            >
              🎯
            </button>
            <button
              onClick={() => setLayout('weekendFocus')}
              className={`px-2 py-0.5 rounded-md transition-all ${layout === 'weekendFocus' ? 'bg-white shadow-sm' : 'opacity-50 hover:opacity-100'}`}
              aria-label="Weekend Focus Layout"
              title="Weekend Focus Layout (4 days on top)"
            >
              🏝️
            </button>
          </div>
          <h3 className="text-3xl font-light text-gray-400">{format(date, 'yyyy')}</h3>
        </div>
      </div>
      
      <div className="grid grid-rows-2 flex-grow border border-gray-200">
        <div className={`grid ${topRowCols} border-b border-gray-200`}>
          {topRowDays.map((day, index) => (
            <div key={day.toString()} className={index < topRowDays.length - 1 ? 'border-r border-gray-200' : ''}>
              <DayBox day={day} events={events} />
            </div>
          ))}
        </div>
        <div className={`grid ${bottomRowCols}`}>
          {bottomRowDays.map((day, index) => (
            <div key={day.toString()} className={index < bottomRowDays.length - 1 ? 'border-r border-gray-200' : ''}>
              <DayBox day={day} events={events} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
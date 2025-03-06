'use client';

import { Event } from '@/app/types/event';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarGridProps {
  events: Event[];
  selectedDate: Date;
}

export default function CalendarGrid({ events, selectedDate }: CalendarGridProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.dtstart);
      const eventEnd = new Date(event.dtend);
      return isSameDay(eventStart, date) || isSameDay(eventEnd, date);
    });
  };

  return (
    <div className="flex-1 p-4">
      <div className="grid grid-cols-7 gap-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map(day => (
          <div key={day} className="text-center font-semibold p-2">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, selectedDate);
          
          return (
            <div
              key={day.toString()}
              className={`min-h-[100px] p-2 border ${
                isCurrentMonth ? 'bg-white' : 'bg-gray-50'
              }`}
            >
              <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.uid}
                    className="text-xs p-1 bg-blue-100 rounded truncate"
                    title={event.summary}
                  >
                    {event.summary}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 
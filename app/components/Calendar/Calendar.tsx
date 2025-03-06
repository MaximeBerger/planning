'use client';

import { useState } from 'react';
import { Event, EventFilters } from '@/app/types/event';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventList from './EventList';
import FilterPanel from './FilterPanel';

interface CalendarProps {
  events: Event[];
}

export default function Calendar({ events }: CalendarProps) {
  const [filters, setFilters] = useState<EventFilters>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const filteredEvents = events.filter(event => {
    if (filters.formateur && !event.description.formateurs.includes(filters.formateur)) return false;
    if (filters.groupe && !event.description.groupes.includes(filters.groupe)) return false;
    if (filters.resource && !event.description.resources.includes(filters.resource)) return false;
    if (filters.type) {
      const eventType = event.summary.split(' - ')[0];
      if (!eventType.includes(filters.type)) return false;
    }
    if (filters.dateRange) {
      const eventStart = new Date(event.dtstart);
      const eventEnd = new Date(event.dtend);
      if (eventStart < filters.dateRange.start || eventEnd > filters.dateRange.end) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-screen">
      <CalendarHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <div className="flex flex-1 overflow-hidden">
        <FilterPanel filters={filters} onFiltersChange={setFilters} />
        <div className="flex-1 flex flex-col">
          <CalendarGrid events={filteredEvents} selectedDate={selectedDate} />
          <EventList events={filteredEvents} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
} 
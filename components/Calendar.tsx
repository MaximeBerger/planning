'use client';

import { useState, useEffect } from 'react';
import ICAL from 'ical.js';
import WeekView from './WeekView';
import FilterPanel from './FilterPanel';
import { parseDescriptionString, extractUniqueCategories } from '../utils/stringParser';

export interface Event {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  category?: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await fetch('/api/calendar');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du calendrier');
        }
        const data = await response.text();
        
        // Parser le fichier iCal
        const jcalData = ICAL.parse(data);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents('vevent');
        
        const parsedEvents = vevents.map(vevent => {
          const event = new ICAL.Event(vevent);
          const component = event.component;
          const categoryValue = component.getFirstPropertyValue('categories');
          return {
            title: event.summary,
            start: event.startDate.toJSDate(),
            end: event.endDate.toJSDate(),
            description: event.description,
            location: event.location,
            category: categoryValue ? String(categoryValue) : undefined
          };
        });

        setEvents(parsedEvents);
      } catch (err) {
        setError('Erreur lors du chargement du calendrier');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, []);

  const filteredEvents = events.filter(event => 
    selectedCategories.length === 0 || 
    selectedCategories.some(category => event.description?.includes(category) ?? false)
  );

  if (loading) {
    return <div className="p-4">Chargement du calendrier...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  const { categories, filterOptions, hierarchicalOptions } = extractUniqueCategories(events);

  console.log("events", events.map((event) => parseDescriptionString(event.description)));

  return (
    <div className="relative" onClick={() => setIsFilterPanelOpen(false)}>
      <div className={`p-4 transition-all duration-300 ${isFilterPanelOpen ? 'blur-sm' : ''}`}>
        <WeekView events={filteredEvents} />
      </div>
      
      <div 
        className={`absolute top-0 right-0 h-full bg-white border-l border-gray-200 transition-all duration-300 cursor-pointer ${
          isFilterPanelOpen ? 'w-4/5 translate-x-0' : 'w-64 translate-x-full'
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsFilterPanelOpen(true);
        }}
      >
        <FilterPanel 
          events={events}
          categories={categories}
          filterOptions={filterOptions}
          hierarchicalOptions={hierarchicalOptions}
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
        />
      </div>
    </div>
  );
} 
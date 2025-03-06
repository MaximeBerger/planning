'use client';

import { useState, useEffect } from 'react';
import ICAL from 'ical.js';
import WeekView from './WeekView';

interface Event {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          return {
            title: event.summary,
            start: event.startDate.toJSDate(),
            end: event.endDate.toJSDate(),
            description: event.description,
            location: event.location
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

  if (loading) {
    return <div className="p-4">Chargement du calendrier...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <WeekView events={events} />
    </div>
  );
} 
'use client';

import { Event } from '@/app/types/event';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EventListProps {
  events: Event[];
  selectedDate: Date;
}

export default function EventList({ events, selectedDate }: EventListProps) {
  const selectedDayEvents = events.filter(event => {
    const eventStart = new Date(event.dtstart);
    return isSameDay(eventStart, selectedDate);
  });

  return (
    <div className="h-64 border-t overflow-y-auto">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Événements du {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
        </h3>
        
        {selectedDayEvents.length === 0 ? (
          <p className="text-gray-500">Aucun événement pour cette journée</p>
        ) : (
          <div className="space-y-4">
            {selectedDayEvents.map(event => (
              <div
                key={event.uid}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-lg mb-2">{event.summary}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Horaires :</span>{' '}
                    {format(new Date(event.dtstart), 'HH:mm')} -{' '}
                    {format(new Date(event.dtend), 'HH:mm')}
                  </p>
                  <p>
                    <span className="font-medium">Lieu :</span> {event.location}
                  </p>
                  <p>
                    <span className="font-medium">Formateur :</span>{' '}
                    {event.description.formateurs.join(', ')}
                  </p>
                  <p>
                    <span className="font-medium">Groupes :</span>{' '}
                    {event.description.groupes.join(', ')}
                  </p>
                  <p>
                    <span className="font-medium">Ressources :</span>{' '}
                    {event.description.resources.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 
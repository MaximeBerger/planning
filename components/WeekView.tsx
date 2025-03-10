'use client';

import { useState } from 'react';

interface Event {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}

interface WeekViewProps {
  events: Event[];
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7h à 19h
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const CELL_HEIGHT = 48; // hauteur d'une cellule en pixels

// Palette de couleurs harmonieuses
const EVENT_COLORS = [
  { bg: 'bg-blue-100 hover:bg-blue-200', border: 'border-blue-200', text: 'text-blue-900' },
  { bg: 'bg-emerald-100 hover:bg-emerald-200', border: 'border-emerald-200', text: 'text-emerald-900' },
  { bg: 'bg-violet-100 hover:bg-violet-200', border: 'border-violet-200', text: 'text-violet-900' },
  { bg: 'bg-amber-100 hover:bg-amber-200', border: 'border-amber-200', text: 'text-amber-900' },
  { bg: 'bg-rose-100 hover:bg-rose-200', border: 'border-rose-200', text: 'text-rose-900' },
  { bg: 'bg-cyan-100 hover:bg-cyan-200', border: 'border-cyan-200', text: 'text-cyan-900' },
  { bg: 'bg-lime-100 hover:bg-lime-200', border: 'border-lime-200', text: 'text-lime-900' },
  { bg: 'bg-fuchsia-100 hover:bg-fuchsia-200', border: 'border-fuchsia-200', text: 'text-fuchsia-900' },
  { bg: 'bg-orange-100 hover:bg-orange-200', border: 'border-orange-200', text: 'text-orange-900' },
  { bg: 'bg-teal-100 hover:bg-teal-200', border: 'border-teal-200', text: 'text-teal-900' },
];

export default function WeekView({ events }: WeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [colorMap] = useState(new Map<string, number>());

  // Fonction pour obtenir l'index de couleur pour un titre
  const getColorIndex = (title: string) => {
    const key = title.slice(-5); // Prendre les 5 dernières lettres
    if (!colorMap.has(key)) {
      colorMap.set(key, colorMap.size % EVENT_COLORS.length);
    }
    return colorMap.get(key) || 0;
  };

  // Obtenir le début de la semaine (Lundi)
  const getWeekStart = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const weekStart = getWeekStart(new Date(currentDate));
  const weekDays = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  // Filtrer les événements pour la semaine en cours
  const weekEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return eventDate >= new Date(weekStart.getTime() - 24 * 60 * 60 * 1000) && eventDate < new Date(weekStart.getTime() + 5 * 24 * 60 * 60 * 1000);
  });

  // Calculer la position et la hauteur de chaque événement
  const getEventStyle = (event: Event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const dayIndex = start.getDay() - 1; // -1 car on commence à Lundi
    
    // Calculer les heures et minutes
    const startHour = start.getHours();
    const startMinutes = start.getMinutes();
    const endHour = end.getHours();
    const endMinutes = end.getMinutes();
    
    // Calculer la position en pixels
    const startFromMidnight = startHour * 60 + startMinutes;
    const endFromMidnight = endHour * 60 + endMinutes;
    const startFromSevenAM = startFromMidnight - (7 * 60);
    const durationInMinutes = endFromMidnight - startFromMidnight;
    
    // Convertir les minutes en pixels
    const pixelsPerMinute = CELL_HEIGHT / 60;
    const topPosition = startFromSevenAM * pixelsPerMinute;
    const height = durationInMinutes * pixelsPerMinute;

    // Calculer la largeur et la position horizontale
    const isHalfWidth = event.description?.endsWith('/2') ?? false;
    const columnWidth = 100 / 5; // 20% pour chaque jour
    const isGroup2 = event.description?.endsWith('2/2') ?? false;
    const width = isHalfWidth ? columnWidth / 2 : columnWidth;
    const left = dayIndex * columnWidth + (isGroup2 ? columnWidth / 2 : 0);
    
    return {
      top: `${topPosition}px`,
      height: `${height}px`,
      left: `${left}%`,
      width: `${width}%`
    };
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Semaine du {weekStart.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 border border-blue-200"
          >
            Semaine précédente
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
            className="px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 border border-blue-200"
          >
            Semaine suivante
          </button>
        </div>
      </div>

      <div className="relative border rounded-lg overflow-hidden bg-white">
        {/* En-tête des jours */}
        <div className="flex border-b">
          <div className="w-20 border-r bg-gray-100"></div>
          {DAYS.map((day, index) => (
            <div
              key={day}
              className="flex-1 text-center py-2 border-r bg-gray-100"
            >
              <div className="font-semibold text-gray-900">
                {day} {weekDays[index].toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </div>
            </div>
          ))}
        </div>

        {/* Conteneur de la grille avec position relative */}
        <div className="relative">
          {/* Grille de fond avec les lignes horizontales */}
          <div className="absolute inset-0">
            {HOURS.map((hour) => (
              <div key={hour} className="h-12 border-b" />
            ))}
          </div>

          {/* Contenu principal */}
          <div className="flex relative">
            {/* Colonne des heures */}
            <div className="w-20 relative z-10">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="h-12 flex items-center justify-center bg-white border-r text-sm font-medium text-gray-700"
                >
                  {hour}h
                </div>
              ))}
            </div>

            {/* Grille des jours */}
            <div className="flex-1 relative h-[624px]"> {/* 13 heures * 48px */}
              <div className="grid grid-cols-5 absolute inset-0">
                {DAYS.map((day, dayIndex) => (
                  <div key={day} className="border-r h-full" />
                ))}
              </div>

              {/* Événements */}
              {weekEvents.map((event, index) => {
                const style = getEventStyle(event);
                const colorIndex = getColorIndex(event.title);
                const colors = EVENT_COLORS[colorIndex];
                
                return (
                  <div
                    key={index}
                    className={`absolute rounded p-1 text-xs overflow-hidden transition-colors ${colors.bg} ${colors.border} border`}
                    style={style}
                  >
                    <div className={`font-semibold ${colors.text}`}>{event.title}</div>
                    <div className={colors.text}>
                      {new Date(event.start).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
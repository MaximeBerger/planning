import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../Calendar';
import { Event } from '@/app/types/event';

// Données de test
const mockEvents: Event[] = [
  {
    uid: 'event1',
    dtstart: '2024-03-20T09:00:00',
    dtend: '2024-03-20T10:00:00',
    summary: 'Cours - Mathématiques',
    location: 'Salle 101',
    status: 'CONFIRMED',
    class: 'PUBLIC',
    description: {
      formateurs: ['Jean Dupont'],
      groupes: ['Groupe A'],
      resources: ['Salle 101']
    }
  },
  {
    uid: 'event2',
    dtstart: '2024-03-20T11:00:00',
    dtend: '2024-03-20T12:00:00',
    summary: 'TP - Physique',
    location: 'Labo 1',
    status: 'CONFIRMED',
    class: 'PUBLIC',
    description: {
      formateurs: ['Marie Martin'],
      groupes: ['Groupe B'],
      resources: ['Labo 1']
    }
  }
];

describe('Calendar Component', () => {
  it('affiche correctement les événements', () => {
    render(<Calendar events={mockEvents} />);
    
    // Vérifie que les événements sont affichés
    expect(screen.getByText('Cours - Mathématiques')).toBeInTheDocument();
    expect(screen.getByText('TP - Physique')).toBeInTheDocument();
  });

  it('filtre les événements par formateur', () => {
    render(<Calendar events={mockEvents} />);
    
    // Simule la sélection d'un formateur
    const formateurFilter = screen.getByLabelText(/formateur/i);
    fireEvent.change(formateurFilter, { target: { value: 'Jean Dupont' } });
    
    // Vérifie que seul l'événement du formateur sélectionné est affiché
    expect(screen.getByText('Cours - Mathématiques')).toBeInTheDocument();
    expect(screen.queryByText('TP - Physique')).not.toBeInTheDocument();
  });

  it('filtre les événements par groupe', () => {
    render(<Calendar events={mockEvents} />);
    
    // Simule la sélection d'un groupe
    const groupeFilter = screen.getByLabelText(/groupe/i);
    fireEvent.change(groupeFilter, { target: { value: 'Groupe A' } });
    
    // Vérifie que seul l'événement du groupe sélectionné est affiché
    expect(screen.getByText('Cours - Mathématiques')).toBeInTheDocument();
    expect(screen.queryByText('TP - Physique')).not.toBeInTheDocument();
  });

  it('filtre les événements par type', () => {
    render(<Calendar events={mockEvents} />);
    
    // Simule la sélection d'un type d'événement
    const typeFilter = screen.getByLabelText(/type/i);
    fireEvent.change(typeFilter, { target: { value: 'Cours' } });
    
    // Vérifie que seul l'événement du type sélectionné est affiché
    expect(screen.getByText('Cours - Mathématiques')).toBeInTheDocument();
    expect(screen.queryByText('TP - Physique')).not.toBeInTheDocument();
  });
}); 
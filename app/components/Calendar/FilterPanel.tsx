'use client';

import { EventFilters } from '@/app/types/event';

interface FilterPanelProps {
  filters: EventFilters;
  onFiltersChange: (filters: EventFilters) => void;
}

export default function FilterPanel({ filters, onFiltersChange }: FilterPanelProps) {
  const handleFilterChange = (key: keyof EventFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="w-64 p-4 border-r overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Filtres</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type d'événement</label>
          <select
            className="w-full p-2 border rounded"
            value={filters.type || ''}
            onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
          >
            <option value="">Tous</option>
            <option value="CM">Cours Magistral</option>
            <option value="TD">Travaux Dirigés</option>
            <option value="REVISION">Révision</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Formateur</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Rechercher un formateur..."
            value={filters.formateur || ''}
            onChange={(e) => handleFilterChange('formateur', e.target.value || undefined)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Groupe</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Rechercher un groupe..."
            value={filters.groupe || ''}
            onChange={(e) => handleFilterChange('groupe', e.target.value || undefined)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ressource</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder="Rechercher une ressource..."
            value={filters.resource || ''}
            onChange={(e) => handleFilterChange('resource', e.target.value || undefined)}
          />
        </div>
      </div>
    </div>
  );
} 
export interface Event {
  uid: string;
  summary: string;
  dtstart: string;
  dtend: string;
  location: string;
  description: {
    resources: string[];
    formateurs: string[];
    groupes: string[];
  };
  status: string;
  class: string;
}

export interface EventFilters {
  formateur?: string;
  groupe?: string;
  resource?: string;
  type?: 'CM' | 'TD' | 'REVISION';
  dateRange?: {
    start: Date;
    end: Date;
  };
} 
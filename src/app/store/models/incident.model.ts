export type IncidentType =
  | 'violence'
  | 'bullying'
  | 'harassment'
  | 'theft'
  | 'vandalism'
  | 'substance'
  | 'emergency'
  | 'other';

export type IncidentStatus =
  | 'reported'
  | 'investigating'
  | 'resolved'
  | 'archived'
  | 'pending_review';

export interface Incident {
  incidentID: string;
  reporterID: string;
  type: IncidentType;
  location: string;
  date: string;
  status: IncidentStatus;
  description?: string;
  witnesses?: string[];
}

export interface Resolution {
  resolutionID: string;
  incidentID: string;
  officerID: string;
  actions: string[];
  date: string;
  status: IncidentStatus;
  notes?: string;
}

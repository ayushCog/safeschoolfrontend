import { createAction, props } from '@ngrx/store';
import { Incident, Resolution } from '../models';

// Incident Actions
export const loadIncidents = createAction(
  '[Incidents] Load Incidents'
);

export const loadIncidentsSuccess = createAction(
  '[Incidents] Load Incidents Success',
  props<{ incidents: Incident[] }>()
);

export const loadIncidentsFailure = createAction(
  '[Incidents] Load Incidents Failure',
  props<{ error: string }>()
);

export const addIncident = createAction(
  '[Incidents] Add Incident',
  props<{ incident: Incident }>()
);

export const addIncidentSuccess = createAction(
  '[Incidents] Add Incident Success',
  props<{ incident: Incident }>()
);

export const updateIncident = createAction(
  '[Incidents] Update Incident',
  props<{ incident: Incident }>()
);

export const updateIncidentSuccess = createAction(
  '[Incidents] Update Incident Success',
  props<{ incident: Incident }>()
);

export const deleteIncident = createAction(
  '[Incidents] Delete Incident',
  props<{ incidentID: string }>()
);

export const deleteIncidentSuccess = createAction(
  '[Incidents] Delete Incident Success',
  props<{ incidentID: string }>()
);

// Resolution Actions
export const loadResolutions = createAction(
  '[Incidents] Load Resolutions'
);

export const loadResolutionsSuccess = createAction(
  '[Incidents] Load Resolutions Success',
  props<{ resolutions: Resolution[] }>()
);

export const addResolution = createAction(
  '[Incidents] Add Resolution',
  props<{ resolution: Resolution }>()
);

export const addResolutionSuccess = createAction(
  '[Incidents] Add Resolution Success',
  props<{ resolution: Resolution }>()
);

export const updateResolution = createAction(
  '[Incidents] Update Resolution',
  props<{ resolution: Resolution }>()
);

export const updateResolutionSuccess = createAction(
  '[Incidents] Update Resolution Success',
  props<{ resolution: Resolution }>()
);

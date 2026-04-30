import { createSelector, createFeatureSelector } from '@ngrx/store';
import { IncidentsState } from './incidents.reducer';

export const selectIncidentsState = createFeatureSelector<IncidentsState>('incidents');

export const selectAllIncidents = createSelector(
  selectIncidentsState,
  (state: IncidentsState) => state.incidents
);

export const selectActiveIncidents = createSelector(
  selectAllIncidents,
  (incidents) => incidents.filter((i) => i.status !== 'archived')
);

export const selectIncidentById = (id: string) =>
  createSelector(
    selectAllIncidents,
    (incidents) => incidents.find((i) => i.incidentID === id)
  );

export const selectIncidentsLoading = createSelector(
  selectIncidentsState,
  (state: IncidentsState) => state.isLoading
);

export const selectAllResolutions = createSelector(
  selectIncidentsState,
  (state: IncidentsState) => state.resolutions
);

export const selectPendingResolutions = createSelector(
  selectAllResolutions,
  (resolutions) => resolutions.filter((r) => r.status !== 'resolved')
);

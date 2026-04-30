import { createReducer, on } from '@ngrx/store';
import { Incident, Resolution } from '../models';
import * as IncidentsActions from './incidents.actions';

export interface IncidentsState {
  incidents: Incident[];
  resolutions: Resolution[];
  isLoading: boolean;
  error: string | null;
}

export const initialIncidentsState: IncidentsState = {
  incidents: [],
  resolutions: [],
  isLoading: false,
  error: null,
};

export const incidentsReducer = createReducer(
  initialIncidentsState,
  on(IncidentsActions.loadIncidents, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(IncidentsActions.loadIncidentsSuccess, (state, { incidents }) => ({
    ...state,
    incidents,
    isLoading: false,
  })),
  on(IncidentsActions.loadIncidentsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(IncidentsActions.addIncidentSuccess, (state, { incident }) => ({
    ...state,
    incidents: [...state.incidents, incident],
  })),
  on(IncidentsActions.updateIncidentSuccess, (state, { incident }) => ({
    ...state,
    incidents: state.incidents.map((i) =>
      i.incidentID === incident.incidentID ? incident : i
    ),
  })),
  on(IncidentsActions.deleteIncidentSuccess, (state, { incidentID }) => ({
    ...state,
    incidents: state.incidents.filter((i) => i.incidentID !== incidentID),
  })),
  on(IncidentsActions.loadResolutionsSuccess, (state, { resolutions }) => ({
    ...state,
    resolutions,
  })),
  on(IncidentsActions.addResolutionSuccess, (state, { resolution }) => ({
    ...state,
    resolutions: [...state.resolutions, resolution],
  })),
  on(IncidentsActions.updateResolutionSuccess, (state, { resolution }) => ({
    ...state,
    resolutions: state.resolutions.map((r) =>
      r.resolutionID === resolution.resolutionID ? resolution : r
    ),
  }))
);

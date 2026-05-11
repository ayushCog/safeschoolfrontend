import { createReducer, on } from '@ngrx/store';
import { Incident, Resolution, Training, ComplianceRecord, Program } from '../models';
import * as StaffPortalActions from './staff-portal.actions';

export interface StaffPortalState {
  incidents: Incident[];
  resolutions: Resolution[];
  trainings: Training[];
  programs: Program[];
  complianceRecords: ComplianceRecord[];
  isLoading: boolean;
  error: string | null;
}

export const initialStaffPortalState: StaffPortalState = {
  incidents: [],
  resolutions: [],
  trainings: [],
  programs: [],
  complianceRecords: [],
  isLoading: false,
  error: null,
};

export const staffPortalReducer = createReducer(
  initialStaffPortalState,
  on(StaffPortalActions.loadStaffIncidents, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(StaffPortalActions.loadStaffIncidentsSuccess, (state, { incidents }) => ({
    ...state,
    incidents,
    isLoading: false,
  })),
  on(StaffPortalActions.logIncidentSuccess, (state, { incident }) => ({
    ...state,
    incidents: [...state.incidents, incident],
  })),
  on(StaffPortalActions.updateIncidentStatusSuccess, (state, { incidentID, status }) => ({
    ...state,
    incidents: state.incidents.map((i) =>
      i.incidentID === incidentID ? { ...i, status: status as any } : i
    ),
  })),
  on(StaffPortalActions.loadTrainingsSuccess, (state, { trainings }) => ({
    ...state,
    trainings,
    isLoading: false,
  })),
  on(StaffPortalActions.loadPrograms, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(StaffPortalActions.loadProgramsSuccess, (state, { programs }) => ({
    ...state,
    programs,
    isLoading: false,
  })),
  on(StaffPortalActions.enrollInProgramSuccess, (state, { training }) => ({
    ...state,
    trainings: [...state.trainings, training],
  })),
  on(StaffPortalActions.markTrainingCompleteSuccess, (state, { training }) => ({
    ...state,
    trainings: state.trainings.map((t) =>
      t.trainingId === training.trainingId ? training : t
    ),
  })),

  on(StaffPortalActions.loadComplianceStatusSuccess, (state, { records }) => ({
    ...state,
    complianceRecords: records,
    isLoading: false,
  })),
  on(StaffPortalActions.loadResolutionsSuccess, (state, { resolutions }) => ({
    ...state,
    resolutions,
  })),
  on(StaffPortalActions.addResolutionSuccess, (state, { resolution, incidentID }) => ({
    ...state,
    resolutions: [...state.resolutions, resolution],
    incidents: state.incidents.map((i) =>
      i.incidentID === incidentID ? { ...i, status: 'resolved' as const } : i
    ),
  })),
  on(StaffPortalActions.addResolutionFailure, (state, { error }) => ({
    ...state,
    error: error,
  })),
);
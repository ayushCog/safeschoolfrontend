import { createAction, props } from '@ngrx/store';
import { Incident, Resolution, Training, Program } from '../models';

// Incident Logging Actions
export const loadStaffIncidents = createAction(
  '[Staff Portal] Load Incidents'
);

export const loadStaffIncidentsSuccess = createAction(
  '[Staff Portal] Load Incidents Success',
  props<{ incidents: Incident[] }>()
);

export const logIncident = createAction(
  '[Staff Portal] Log Incident',
  props<{ incident: Incident }>()
);

export const logIncidentSuccess = createAction(
  '[Staff Portal] Log Incident Success',
  props<{ incident: Incident }>()
);

export const updateIncidentStatus = createAction(
  '[Staff Portal] Update Incident Status',
  props<{ incidentID: string; status: string }>()
);

export const updateIncidentStatusSuccess = createAction(
  '[Staff Portal] Update Incident Status Success',
  props<{ incidentID: string; status: string }>()
);

// Training Actions
export const loadTrainings = createAction(
  '[Staff Portal] Load Trainings'
);

export const loadTrainingsSuccess = createAction(
  '[Staff Portal] Load Trainings Success',
  props<{ trainings: Training[] }>()
);

export const loadPrograms = createAction(
  '[Staff Portal] Load Programs'
);

export const loadProgramsSuccess = createAction(
  '[Staff Portal] Load Programs Success',
  props<{ programs: Program[] }>()
);

export const enrollInProgram = createAction(
  '[Staff Portal] Enroll In Program',
  props<{ programId: string }>()
);

export const enrollInProgramSuccess = createAction(
  '[Staff Portal] Enroll In Program Success',
  props<{ training: Training }>()
);

export const markTrainingComplete = createAction(
  '[Staff Portal] Mark Training Complete',
  props<{ trainingId: string }>()
);

export const markTrainingCompleteSuccess = createAction(
  '[Staff Portal] Mark Training Complete Success',
  props<{ training: Training }>()
);

// Resolution Actions
export const loadResolutions = createAction(
  '[Staff Portal] Load Resolutions'
);

export const loadResolutionsSuccess = createAction(
  '[Staff Portal] Load Resolutions Success',
  props<{ resolutions: Resolution[] }>()
);

export const addResolution = createAction(
  '[Staff Portal] Add Resolution',
  props<{ resolution: Resolution; incidentID: string }>()
);

export const addResolutionSuccess = createAction(
  '[Staff Portal] Add Resolution Success',
  props<{ resolution: Resolution; incidentID: string }>()
);

export const addResolutionFailure = createAction(
  '[Staff Portal] Add Resolution Failure',
  props<{ error: string }>()
);

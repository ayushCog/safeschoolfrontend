import { createAction, props } from '@ngrx/store';
import { Program, Training } from '../models';

export const loadPrograms = createAction('[Programs] Load');
export const loadProgramsSuccess = createAction('[Programs] Load Success', props<{ programs: Program[] }>());
export const loadTrainings = createAction('[Programs] Load Trainings');
export const loadTrainingsSuccess = createAction('[Programs] Load Trainings Success', props<{ trainings: Training[] }>());

export const addProgram = createAction('[Programs] Add', props<{ program: Program }>());
export const addProgramSuccess = createAction('[Programs] Add Success', props<{ program: Program }>());
export const updateProgram = createAction('[Programs] Update', props<{ program: Program }>());
export const updateProgramSuccess = createAction('[Programs] Update Success', props<{ program: Program }>());

export const addTraining = createAction('[Programs] Add Training', props<{ training: Training }>());
export const addTrainingSuccess = createAction('[Programs] Add Training Success', props<{ training: Training }>());
export const updateTraining = createAction('[Programs] Update Training', props<{ training: Training }>());
export const updateTrainingSuccess = createAction('[Programs] Update Training Success', props<{ training: Training }>());

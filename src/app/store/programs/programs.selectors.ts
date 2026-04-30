import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProgramsState } from './programs.reducer';

export const selectProgramsState = createFeatureSelector<ProgramsState>('programs');

export const selectAllPrograms = createSelector(
  selectProgramsState,
  (state) => state.programs
);

export const selectActivePrograms = createSelector(
  selectAllPrograms,
  (programs) => programs.filter((p) => p.status === 'active')
);

export const selectAllTrainings = createSelector(
  selectProgramsState,
  (state) => state.trainings
);

export const selectPendingTrainings = createSelector(
  selectAllTrainings,
  (trainings) => trainings.filter((t) => t.status === 'pending' || t.status === 'in_progress')
);

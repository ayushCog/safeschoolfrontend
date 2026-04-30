import { createReducer, on } from '@ngrx/store';
import { Program, Training } from '../models';
import * as ProgramsActions from './programs.actions';

export interface ProgramsState {
  programs: Program[];
  trainings: Training[];
  isLoading: boolean;
}

export const initialProgramsState: ProgramsState = {
  programs: [],
  trainings: [],
  isLoading: false,
};

export const programsReducer = createReducer(
  initialProgramsState,
  on(ProgramsActions.loadPrograms, (state) => ({ ...state, isLoading: true })),
  on(ProgramsActions.loadProgramsSuccess, (state, { programs }) => ({
    ...state,
    programs,
    isLoading: false,
  })),
  on(ProgramsActions.loadTrainingsSuccess, (state, { trainings }) => ({
    ...state,
    trainings,
  })),
  on(ProgramsActions.addProgramSuccess, (state, { program }) => ({
    ...state,
    programs: [...state.programs, program],
  })),
  on(ProgramsActions.updateProgramSuccess, (state, { program }) => ({
    ...state,
    programs: state.programs.map((p) => (p.programId === program.programId ? program : p)),
  })),
  on(ProgramsActions.addTrainingSuccess, (state, { training }) => ({
    ...state,
    trainings: [...state.trainings, training],
  })),
  on(ProgramsActions.updateTrainingSuccess, (state, { training }) => ({
    ...state,
    trainings: state.trainings.map((t) => (t.trainingId === training.trainingId ? training : t)),
  }))
);

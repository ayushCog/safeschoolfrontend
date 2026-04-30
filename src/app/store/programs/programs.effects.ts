import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ProgramService } from '../../core/services/program.service';
import { TrainingService } from '../../core/services/training.service';
import * as ProgramsActions from './programs.actions';

@Injectable()
export class ProgramsEffects {
  private actions$ = inject(Actions);
  private programService = inject(ProgramService);
  private trainingService = inject(TrainingService);

  loadPrograms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProgramsActions.loadPrograms),
      switchMap(() =>
        this.programService.getPrograms().pipe(
          map((programs) => ProgramsActions.loadProgramsSuccess({ programs })),
          catchError(() => of({ type: '[Programs] Load Error' }))
        )
      )
    )
  );

  loadTrainings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProgramsActions.loadTrainings),
      switchMap(() =>
        of([] as any[]).pipe(
          map((trainings) => ProgramsActions.loadTrainingsSuccess({ trainings })),
          catchError(() => of({ type: '[Programs] Load Trainings Error' }))
        )
      )
    )
  );
}

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, delay, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as StaffPortalActions from './staff-portal.actions';
import { IncidentService } from '../../core/services/incident.service';
import { TrainingService } from '../../core/services/training.service';
import { ProgramService } from '../../core/services/program.service';
import { selectCurrentUser } from '../auth/auth.selectors';

@Injectable()
export class StaffPortalEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private incidentService = inject(IncidentService);
  private trainingService = inject(TrainingService);
  private programService = inject(ProgramService);

  loadStaffIncidents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.loadStaffIncidents),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([_, user]) => {
        if (!user) {
          return of({ type: '[Staff Portal] Load Incidents Failure', error: 'User not authenticated' });
        }
        return this.incidentService.getIncidents().pipe(
          map((incidents) => StaffPortalActions.loadStaffIncidentsSuccess({ incidents })),
          catchError((error) =>
            of({ type: '[Staff Portal] Load Incidents Failure', error: error.message })
          )
        );
      })
    )
  );

  loadTrainings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.loadTrainings),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([_, user]) => {
        if (!user) {
          return of({ type: '[Staff Portal] Load Trainings Failure', error: 'User not authenticated' });
        }
        return this.trainingService.getTrainingsByUser(user.userID).pipe(
          map((trainings) => StaffPortalActions.loadTrainingsSuccess({ trainings })),
          catchError((error) =>
            of({ type: '[Staff Portal] Load Trainings Failure', error: error.message })
          )
        );
      })
    )
  );

  loadPrograms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.loadPrograms),
      mergeMap(() =>
        this.programService.getPrograms().pipe(
          map((programs) => StaffPortalActions.loadProgramsSuccess({ programs })),
          catchError((error) =>
            of({ type: '[Staff Portal] Load Programs Failure', error: error.message })
          )
        )
      )
    )
  );

  enrollInProgram$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.enrollInProgram),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([{ programId }, user]) => {
        if (!user) {
          return of({ type: '[Staff Portal] Enroll Failure', error: 'User not authenticated' });
        }
        const today = new Date();
        const completionDate = `${String(today.getDate()).padStart(2, '0')}/${String(
          today.getMonth() + 1
        ).padStart(2, '0')}/${today.getFullYear()}`;

        const trainingInput = {
          programId: programId,
          userId: user.userID,
          status: 'pending' as const,
          completionDate,
          certificationExpiry: undefined,
        };
        return this.trainingService.createTraining(trainingInput).pipe(
          map((training) => StaffPortalActions.enrollInProgramSuccess({ training })),
          catchError((error) =>
            of({ type: '[Staff Portal] Enroll Failure', error: error.message })
          )
        );
      })
    )
  );
  markTrainingComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.markTrainingComplete),
      mergeMap(({ trainingId }) =>
        this.trainingService.updateTraining(trainingId, 'completed').pipe(
          map((training) => StaffPortalActions.markTrainingCompleteSuccess({ training })),
          catchError((error) =>
            of({ type: '[Staff Portal] Mark Training Complete Failure', error: error.message })
          )
        )
      )
    )
  );

  loadResolutions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.loadResolutions),
      withLatestFrom(this.store.select(selectCurrentUser)),
      mergeMap(([_, user]) => {
        if (!user) {
          return of({ type: '[Staff Portal] Load Resolutions Failure', error: 'User not authenticated' });
        }
        return this.incidentService.getResolutionsByUserId(user.userID).pipe(
          map((resolutions) => StaffPortalActions.loadResolutionsSuccess({ resolutions })),
          catchError((error) =>
            of({ type: '[Staff Portal] Load Resolutions Failure', error: error.message })
          )
        );
      })
    )
  );

  logIncident$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.logIncident),
      mergeMap(({ incident }) =>
        this.incidentService.createIncident(incident).pipe(
          map((newIncident) => StaffPortalActions.logIncidentSuccess({ incident: newIncident })),
          catchError((error) =>
            of({ type: '[Staff Portal] Log Incident Failure', error: error.message })
          )
        )
      )
    )
  );

  addResolution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.addResolution),
      switchMap(({ resolution, incidentID }) =>
        this.incidentService.createResolution(resolution).pipe(
          map((newResolution) =>
            StaffPortalActions.addResolutionSuccess({ 
              resolution: newResolution,
              incidentID
            })
          ),
          catchError((error) => {
            console.log(error);
            return of(StaffPortalActions.addResolutionFailure({ error: error.error.message }))
          })
        )
      )
    )
  );

  updateIncidentStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StaffPortalActions.updateIncidentStatus),
      mergeMap(({ incidentID, status }) =>
        this.incidentService.updateIncidentStatus(incidentID, status).pipe(
          map(() =>
            StaffPortalActions.updateIncidentStatusSuccess({ incidentID, status })
          ),
          catchError((error) =>
            of({ type: '[Staff Portal] Update Incident Status Failure', error: error.message })
          )
        )
      )
    )
  );
}
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IncidentService } from '../../core/services/incident.service';
import * as IncidentsActions from './incidents.actions';

@Injectable()
export class IncidentsEffects {
  private actions$ = inject(Actions);
  private incidentService = inject(IncidentService);

  loadIncidents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncidentsActions.loadIncidents),
      switchMap(() =>
        this.incidentService.getIncidents().pipe(
          map((incidents) =>
            IncidentsActions.loadIncidentsSuccess({ incidents })
          ),
          catchError((error) =>
            of(IncidentsActions.loadIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addIncident$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncidentsActions.addIncident),
      switchMap(({ incident }) =>
        this.incidentService.createIncident(incident).pipe(
          map((newIncident) =>
            IncidentsActions.addIncidentSuccess({ incident: newIncident })
          ),
          catchError((error) =>
            of(IncidentsActions.loadIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateIncident$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncidentsActions.updateIncident),
      switchMap(({ incident }) =>
        this.incidentService.updateIncident(incident).pipe(
          map((updatedIncident) =>
            IncidentsActions.updateIncidentSuccess({ incident: updatedIncident })
          ),
          catchError((error) =>
            of(IncidentsActions.loadIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteIncident$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncidentsActions.deleteIncident),
      switchMap(({ incidentID }) =>
        this.incidentService.deleteIncident(incidentID).pipe(
          map(() =>
            IncidentsActions.deleteIncidentSuccess({ incidentID })
          ),
          catchError((error) =>
            of(IncidentsActions.loadIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadResolutions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncidentsActions.loadResolutions),
      switchMap(() =>
        this.incidentService.getResolutions().pipe(
          map((resolutions) =>
            IncidentsActions.loadResolutionsSuccess({ resolutions })
          ),
          catchError((error) =>
            of(IncidentsActions.loadIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addResolution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncidentsActions.addResolution),
      switchMap(({ resolution }) =>
        this.incidentService.createResolution(resolution).pipe(
          map((newResolution) =>
            IncidentsActions.addResolutionSuccess({ resolution: newResolution })
          ),
          catchError((error) =>
            of(IncidentsActions.loadIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updateResolution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(IncidentsActions.updateResolution),
      switchMap(({ resolution }) =>
        this.incidentService.updateResolution(resolution).pipe(
          map((updatedResolution) =>
            IncidentsActions.updateResolutionSuccess({
              resolution: updatedResolution,
            })
          ),
          catchError((error) =>
            of(IncidentsActions.loadIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}

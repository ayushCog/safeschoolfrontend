import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as StudentPortalActions from './student-portal.actions';
import { IncidentService } from '../../core/services/incident.service';
import { selectCurrentUser } from '../auth/auth.selectors';

@Injectable()
export class StudentPortalEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private incidentService = inject(IncidentService);

  loadStudentIncidentReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentPortalActions.loadStudentIncidentReports),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([_, user]) => {
        if (!user) {
          return of(
            StudentPortalActions.loadStudentIncidentReportsFailure({
              error: 'User not authenticated',
            })
          );
        }
        return this.incidentService.getIncidentsByUserId(user.userID).pipe(
          map((reports) => StudentPortalActions.loadStudentIncidentReportsSuccess({ reports })),
          catchError((error) =>
            of(StudentPortalActions.loadStudentIncidentReportsFailure({ error: error.message }))
          )
        );
      })
    )
  );

  addStudentIncidentReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentPortalActions.addStudentIncidentReport),
      switchMap(({ report }) =>
        this.incidentService.createIncident(report).pipe(
          map((savedReport) =>
            StudentPortalActions.addStudentIncidentReportSuccess({ report: savedReport })
          ),
          catchError((error) =>
            of(StudentPortalActions.loadStudentIncidentReportsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadEmergencyAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentPortalActions.loadEmergencyAlerts),
      switchMap(() =>
        this.incidentService.getIncidents().pipe(
          map((incidents) =>
            StudentPortalActions.loadEmergencyAlertsSuccess({
              alerts: incidents.map((i) => ({
                notificationID: i.incidentID,
                userID: i.reporterID,
                entityID: i.incidentID,
                message: `Incident alert: ${i.type} at ${i.location}`,
                category: 'alert' as const,
                status: 'unread' as const,
                createdDate: i.date,
              })),
            })
          ),
          catchError((error) =>
            of(StudentPortalActions.loadEmergencyAlertsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadStudentNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentPortalActions.loadStudentNotifications),
      switchMap(() =>
        this.incidentService.getIncidents().pipe(
          map((incidents) =>
            StudentPortalActions.loadStudentNotificationsSuccess({
              notifications: incidents.map((i) => ({
                notificationID: i.incidentID,
                userID: i.reporterID,
                entityID: i.incidentID,
                message: `Notification for incident ${i.incidentID}: Status is ${i.status}`,
                category: 'incident' as const,
                status: 'unread' as const,
                createdDate: i.date,
              })),
            })
          ),
          catchError((error) =>
            of(StudentPortalActions.loadStudentNotificationsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
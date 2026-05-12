import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as StudentPortalActions from './student-portal.actions';
import { IncidentService } from '../../core/services/incident.service';
import { NotificationService } from '../../core/services/notification.service';
import { selectCurrentUser } from '../auth/auth.selectors';

@Injectable()
export class StudentPortalEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private incidentService = inject(IncidentService);
  private notificationService = inject(NotificationService);

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

  loadStudentNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentPortalActions.loadStudentNotifications),
      withLatestFrom(this.store.select(selectCurrentUser)),
      switchMap(([_, user]) => {
        if (!user) {
          return of(
            StudentPortalActions.loadStudentNotificationsFailure({
              error: 'User not authenticated',
            })
          );
        }
        return this.notificationService.getUnreadNotifications(user.userID).pipe(
          map((notifications) =>
            StudentPortalActions.loadStudentNotificationsSuccess({ notifications })
          ),
          catchError((error) =>
            of(StudentPortalActions.loadStudentNotificationsFailure({ error: error.message }))
          )
        );
      })
    )
  );

  markStudentNotificationRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StudentPortalActions.markStudentNotificationRead),
      switchMap(({ userId, notificationId }) =>
        this.notificationService.markAsRead(userId, notificationId).pipe(
          map(() =>
            StudentPortalActions.markStudentNotificationReadSuccess({ notificationId })
          ),
          catchError((error) =>
            of(StudentPortalActions.markStudentNotificationReadFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
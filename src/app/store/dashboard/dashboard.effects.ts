import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as DashboardActions from './dashboard.actions';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);

  loadDashboardStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboardStats),
      mergeMap(() =>
        // Mock API call - replace with actual service
        of({
          totalIncidents: 45,
          activeIncidents: 12,
          resolvedIncidents: 33,
          totalUsers: 1250,
          totalPrograms: 8,
          complianceRate: 94.5,
        }).pipe(
          map((stats) => DashboardActions.loadDashboardStatsSuccess({ stats })),
          catchError((error) =>
            of(DashboardActions.loadDashboardStatsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadRecentIncidents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadRecentIncidents),
      mergeMap(() =>
        // Mock API call - replace with actual service
        of([
          {
            id: 1,
            title: 'Student altercation in cafeteria',
            status: 'active',
            priority: 'high',
            reportedAt: new Date(),
          },
          {
            id: 2,
            title: 'Medical emergency in gym',
            status: 'resolved',
            priority: 'critical',
            reportedAt: new Date(Date.now() - 3600000),
          },
        ]).pipe(
          map((incidents) => DashboardActions.loadRecentIncidentsSuccess({ incidents })),
          catchError((error) =>
            of(DashboardActions.loadRecentIncidentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadNotifications),
      mergeMap(() =>
        // Mock API call - replace with actual service
        of([
          {
            id: 1,
            message: 'New safety training available',
            type: 'info',
            read: false,
            createdAt: new Date(),
          },
          {
            id: 2,
            message: 'Compliance audit due next week',
            type: 'warning',
            read: false,
            createdAt: new Date(Date.now() - 1800000),
          },
        ]).pipe(
          map((notifications) => DashboardActions.loadNotificationsSuccess({ notifications })),
          catchError((error) =>
            of(DashboardActions.loadNotificationsFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
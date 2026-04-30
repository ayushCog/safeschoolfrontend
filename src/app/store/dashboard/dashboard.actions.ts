import { createAction, props } from '@ngrx/store';

export const loadDashboardStats = createAction('[Dashboard] Load Stats');

export const loadDashboardStatsSuccess = createAction(
  '[Dashboard] Load Stats Success',
  props<{ stats: any }>()
);

export const loadDashboardStatsFailure = createAction(
  '[Dashboard] Load Stats Failure',
  props<{ error: string }>()
);

export const loadRecentIncidents = createAction('[Dashboard] Load Recent Incidents');

export const loadRecentIncidentsSuccess = createAction(
  '[Dashboard] Load Recent Incidents Success',
  props<{ incidents: any[] }>()
);

export const loadRecentIncidentsFailure = createAction(
  '[Dashboard] Load Recent Incidents Failure',
  props<{ error: string }>()
);

export const loadNotifications = createAction('[Dashboard] Load Notifications');

export const loadNotificationsSuccess = createAction(
  '[Dashboard] Load Notifications Success',
  props<{ notifications: any[] }>()
);

export const loadNotificationsFailure = createAction(
  '[Dashboard] Load Notifications Failure',
  props<{ error: string }>()
);
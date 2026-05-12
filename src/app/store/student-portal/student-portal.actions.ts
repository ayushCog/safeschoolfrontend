import { createAction, props } from '@ngrx/store';
import { Incident, Notification } from '../models';

export const loadStudentIncidentReports = createAction(
  '[Student Portal] Load Incident Reports'
);

export const loadStudentIncidentReportsSuccess = createAction(
  '[Student Portal] Load Incident Reports Success',
  props<{ reports: Incident[] }>()
);

export const loadStudentIncidentReportsFailure = createAction(
  '[Student Portal] Load Incident Reports Failure',
  props<{ error: string }>()
);

export const addStudentIncidentReport = createAction(
  '[Student Portal] Add Incident Report',
  props<{ report: Incident }>()
);

export const addStudentIncidentReportSuccess = createAction(
  '[Student Portal] Add Incident Report Success',
  props<{ report: Incident }>()
);

export const loadEmergencyAlerts = createAction(
  '[Student Portal] Load Emergency Alerts'
);

export const loadEmergencyAlertsSuccess = createAction(
  '[Student Portal] Load Emergency Alerts Success',
  props<{ alerts: Notification[] }>()
);

export const loadEmergencyAlertsFailure = createAction(
  '[Student Portal] Load Emergency Alerts Failure',
  props<{ error: string }>()
);

export const loadStudentNotifications = createAction(
  '[Student Portal] Load Notifications'
);

export const loadStudentNotificationsSuccess = createAction(
  '[Student Portal] Load Notifications Success',
  props<{ notifications: Notification[] }>()
);

export const loadStudentNotificationsFailure = createAction(
  '[Student Portal] Load Notifications Failure',
  props<{ error: string }>()
);

export const markStudentNotificationRead = createAction(
  '[Student Portal] Mark Notification Read',
  props<{ userId: string; notificationId: string }>()
);

export const markStudentNotificationReadSuccess = createAction(
  '[Student Portal] Mark Notification Read Success',
  props<{ notificationId: string }>()
);

export const markStudentNotificationReadFailure = createAction(
  '[Student Portal] Mark Notification Read Failure',
  props<{ error: string }>()
);

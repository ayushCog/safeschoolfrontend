import { createReducer, on } from '@ngrx/store';
import { Incident, Notification, Resolution } from '../models';
import * as StudentPortalActions from './student-portal.actions';

export interface StudentPortalState {
  reports: Incident[];
  alerts: Notification[];
  notifications: Notification[];
  resolutions: Resolution[];
  isLoading: boolean;
  error: string | null;
}

export const initialStudentPortalState: StudentPortalState = {
  reports: [],
  alerts: [],
  notifications: [],
  resolutions: [],
  isLoading: false,
  error: null,
};

export const studentPortalReducer = createReducer(
  initialStudentPortalState,
  on(StudentPortalActions.loadStudentIncidentReports, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(StudentPortalActions.loadStudentIncidentReportsSuccess, (state, { reports }) => ({
    ...state,
    reports,
    isLoading: false,
  })),
  on(StudentPortalActions.loadStudentIncidentReportsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(StudentPortalActions.addStudentIncidentReportSuccess, (state, { report }) => ({
    ...state,
    reports: [...state.reports, report],
  })),
  on(StudentPortalActions.loadEmergencyAlerts, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(StudentPortalActions.loadEmergencyAlertsSuccess, (state, { alerts }) => ({
    ...state,
    alerts,
    isLoading: false,
  })),
  on(StudentPortalActions.loadEmergencyAlertsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(StudentPortalActions.loadStudentNotifications, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(StudentPortalActions.loadStudentNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications,
    isLoading: false,
  })),
  on(StudentPortalActions.loadStudentNotificationsFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  })),
  on(StudentPortalActions.markStudentNotificationRead, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(StudentPortalActions.markStudentNotificationReadSuccess, (state, { notificationId }) => ({
    ...state,
    notifications: state.notifications.filter(
      (notification) => notification.notificationID !== notificationId
    ),
    isLoading: false,
  })),
  on(StudentPortalActions.markStudentNotificationReadFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false,
  }))
);
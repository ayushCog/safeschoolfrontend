import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StudentPortalState } from './student-portal.reducer';
import { selectCurrentUser } from '../auth/auth.selectors';

export const selectStudentPortalState = createFeatureSelector<StudentPortalState>('studentPortal');

export const selectStudentIncidentReports = createSelector(
  selectStudentPortalState,
  (state) => state.reports
);

export const selectStudentIncidentReportsForCurrentUser = createSelector(
  selectStudentIncidentReports,
  selectCurrentUser,
  (reports, user) => {
    if (!user) return [];
    return reports.filter((report) => report.reporterID === user.userID);
  }
);

export const selectStudentEmergencyAlerts = createSelector(
  selectStudentPortalState,
  (state) => state.alerts
);

export const selectStudentNotifications = createSelector(
  selectStudentPortalState,
  (state) => state.notifications
);

export const selectStudentPortalLoading = createSelector(
  selectStudentPortalState,
  (state) => state.isLoading
);

export const selectStudentPortalError = createSelector(
  selectStudentPortalState,
  (state) => state.error
);

export const selectStudentResolutions = createSelector(
  selectStudentPortalState,
  (state) => state.resolutions
);

export const selectStudentResolutionsForCurrentUser = createSelector(
  selectStudentResolutions,
  selectStudentIncidentReportsForCurrentUser,
  (resolutions, userIncidents) => {
    const userIncidentIDs = userIncidents.map((i) => i.incidentID);
    return resolutions.filter((res: any) => userIncidentIDs.includes(res.incidentID));
  }
);

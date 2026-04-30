import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StaffPortalState } from './staff-portal.reducer';
import { selectCurrentUser } from '../auth/auth.selectors';

export const selectStaffPortalState = createFeatureSelector<StaffPortalState>('staffPortal');

export const selectStaffIncidents = createSelector(
  selectStaffPortalState,
  (state) => state.incidents
);

export const selectStaffResolutions = createSelector(
  selectStaffPortalState,
  (state) => state.resolutions
);

export const selectStaffIncidentsForCurrentUser = createSelector(
  selectStaffIncidents,
  selectCurrentUser,
  (incidents, user) => {
    if (!user) return [];
    return incidents.filter((incident) => incident.reporterID === user.userID);
  }
);

export const selectStaffResolutionsForCurrentUser = createSelector(
  selectStaffResolutions,
  selectCurrentUser,
  (resolutions, user) => {
    if (!user) return [];
    return resolutions.filter((resolution) => resolution.officerID === user.userID);
  }
);

export const selectStaffTrainings = createSelector(
  selectStaffPortalState,
  (state) => state.trainings
);

export const selectStaffPrograms = createSelector(
  selectStaffPortalState,
  (state) => state.programs
);

export const selectActivePrograms = createSelector(
  selectStaffPrograms,
  (programs) => programs.filter(p => p.status.toLowerCase() === 'active')
);

export const selectComplianceRecords = createSelector(
  selectStaffPortalState,
  (state) => state.complianceRecords
);

export const selectStaffPortalLoading = createSelector(
  selectStaffPortalState,
  (state) => state.isLoading
);

export const selectStaffPortalError = createSelector(
  selectStaffPortalState,
  (state) => state.error
);

export const selectPendingIncidents = createSelector(
  selectStaffIncidents,
  (incidents) => incidents.filter((i) => i.status?.toLowerCase?.() !== 'resolved')
);

export const selectComplianceScore = createSelector(
  selectComplianceRecords,
  (records) => {
    if (records.length === 0) return 100;
    const compliant = records.filter((r) => r.result === 'compliant').length;
    return Math.round((compliant / records.length) * 100);
  }
);

export const selectUnresolvedIncidents = createSelector(
  selectStaffIncidentsForCurrentUser,
  (incidents) => incidents.filter((incident) => incident.status !== 'resolved')
);

export const selectStaffResolutionsByCurrentUser = createSelector(
  selectStaffResolutionsForCurrentUser,
  selectCurrentUser,
  (resolutions, user) => {
    if (!user) return [];
    return resolutions.filter((res: any) => res.officerID === user.userID);
  }
);
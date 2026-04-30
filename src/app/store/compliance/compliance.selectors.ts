import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ComplianceState } from './compliance.reducer';

export const selectComplianceState = createFeatureSelector<ComplianceState>('compliance');

export const selectAllRecords = createSelector(
  selectComplianceState,
  (state) => state.records
);

export const selectNonCompliantRecords = createSelector(
  selectAllRecords,
  (records) => records.filter((r) => r.result === 'non_compliant' || r.result === 'partially_compliant')
);

export const selectComplianceSummary = createSelector(
  selectAllRecords,
  (records) => ({
    compliant: records.filter((r) => r.result === 'compliant').length,
    nonCompliant: records.filter((r) => r.result === 'non_compliant' || r.result === 'partially_compliant').length,
    pending: records.filter((r) => r.result === 'pending').length,
  })
);

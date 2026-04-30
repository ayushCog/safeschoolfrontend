import { createReducer, on } from '@ngrx/store';
import { ComplianceRecord } from '../models';
import * as ComplianceActions from './compliance.actions';

export interface ComplianceState {
  records: ComplianceRecord[];
  isLoading: boolean;
}

export const initialComplianceState: ComplianceState = {
  records: [],
  isLoading: false,
};

export const complianceReducer = createReducer(
  initialComplianceState,
  on(ComplianceActions.loadComplianceRecords, (state) => ({ ...state, isLoading: true })),
  on(ComplianceActions.loadComplianceRecordsSuccess, (state, { records }) => ({
    ...state,
    records,
    isLoading: false,
  })),
  on(ComplianceActions.addRecordSuccess, (state, { record }) => ({
    ...state,
    records: [...state.records, record],
  })),
  on(ComplianceActions.updateRecordSuccess, (state, { record }) => ({
    ...state,
    records: state.records.map((r) => (r.complianceID === record.complianceID ? record : r)),
  })),
  on(ComplianceActions.deleteRecordSuccess, (state, { complianceID }) => ({
    ...state,
    records: state.records.filter((r) => r.complianceID !== complianceID),
  }))
);

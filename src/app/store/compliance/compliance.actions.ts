import { createAction, props } from '@ngrx/store';
import { ComplianceRecord } from '../models';

export const loadComplianceRecords = createAction('[Compliance] Load Records');
export const loadComplianceRecordsSuccess = createAction(
  '[Compliance] Load Records Success',
  props<{ records: ComplianceRecord[] }>()
);

export const addRecord = createAction('[Compliance] Add Record', props<{ record: ComplianceRecord }>());
export const addRecordSuccess = createAction('[Compliance] Add Record Success', props<{ record: ComplianceRecord }>());

export const updateRecord = createAction('[Compliance] Update Record', props<{ record: ComplianceRecord }>());
export const updateRecordSuccess = createAction('[Compliance] Update Record Success', props<{ record: ComplianceRecord }>());

export const deleteRecord = createAction('[Compliance] Delete Record', props<{ complianceID: string }>());
export const deleteRecordSuccess = createAction('[Compliance] Delete Record Success', props<{ complianceID: string }>());

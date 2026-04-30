export type ComplianceType =
  | 'policy_adherence'
  | 'incident_response_time'
  | 'training_completion'
  | 'documentation'
  | 'audit'
  | 'other';

export type ComplianceResult = 'compliant' | 'non_compliant' | 'partially_compliant' | 'pending';

export type ComplianceStatus = 'active' | 'archived' | 'in_review';

export interface ComplianceRecord {
  complianceID: string;
  entityID: string;
  type: ComplianceType;
  result: ComplianceResult;
  date: string;
  notes: string;
  status: ComplianceStatus;
  reviewedBy?: string;
  reviewDate?: string;
}

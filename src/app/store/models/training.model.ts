export type TrainingStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'expired';

export interface Training {
  trainingId: string;
  programId: string;
  userId: string;
  completionDate?: string;
  status: TrainingStatus;
  certificationExpiry?: string;
}

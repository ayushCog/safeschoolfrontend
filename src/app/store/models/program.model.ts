export type ProgramStatus = 'active' | 'inactive' | 'archived' | 'planning';

export interface Program {
  programId: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProgramStatus;
  objectives?: string[];
}

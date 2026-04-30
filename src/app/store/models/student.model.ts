export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'transferred';

export interface Student {
  studentID: string;
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  status: StudentStatus;
}

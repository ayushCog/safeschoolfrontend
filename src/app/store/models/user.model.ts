export type UserRole =
  | 'student'
  | 'parent'
  | 'teacher'
  | 'staff'
  | 'safety_officer'
  | 'admin'
  | 'compliance_officer'
  | 'auditor';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'archived';

export interface User {
  userID: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  status: UserStatus;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupUserData {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

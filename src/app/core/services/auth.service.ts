import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppStore } from '../../store/app.store';
import { User, LoginCredentials, UserRole, UserStatus } from '../../store/models';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, finalize, map, switchMap, tap } from 'rxjs/operators';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface StoredSession {
  user: User;
  token: string;
}

interface LoginResponse {
  email: string;
  token: string;
}

interface UserResponse {
  userId: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  status: UserStatus;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:8081';
  private readonly storageKey = 'safeschool-auth-session';
  private store = inject(AppStore);
  private http = inject(HttpClient);

  /**
   * Login user with credentials
   */
  login(credentials: LoginCredentials): Observable<User> {
    this.store.setAuthLoading(true);
    const loginUrl = `${this.baseUrl}/auth/login`;

    return this.http
      .post<ApiResponse<LoginResponse>>(loginUrl, credentials, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        switchMap((loginResponse) => {
          if (!loginResponse.success) {
            throw new Error(loginResponse.message || 'Login failed');
          }

          const token = loginResponse.data.token;
          const email = loginResponse.data.email;

          const userUrl = `${this.baseUrl}/user/email/${encodeURIComponent(email)}`;
          return this.http.get<ApiResponse<UserResponse> | UserResponse>(userUrl, {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            }),
          }).pipe(
            map((response) => {
              const payload = this.extractUserPayload(response);
              const user: User = {
                userID: payload.userId,
                name: payload.name,
                role: payload.role,
                email: payload.email,
                phone: payload.phone,
                status: payload.status,
              };
              this.persistSession(user, token);
              return user;
            })
          );
        }),
        catchError((error) => {
          if (!error || !error.status || error.status === 0) {
            const fallbackUser = this.createMockUser(credentials);
            this.persistSession(fallbackUser, `mock-${credentials.email}`);
            return of(fallbackUser);
          }
          return throwError(() => error);
        }),
        finalize(() => this.store.setAuthLoading(false))
      );
  }

  /**
   * Restore user session from localStorage
   */
  restoreSession(): User | null {
    return this.getStoredUser();
  }

  /**
   * Logout current user
   */
  logout(): Observable<void> {
    this.store.setAuthLoading(true);
    this.clearSession();
    return of(void 0).pipe(
      delay(500),
      tap(() => this.store.setAuthLoading(false))
    );
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.store.isAuthenticated() || !!this.getStoredUser();
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const currentUser = this.store.currentUser();
    return currentUser || this.getStoredUser();
  }

  /**
   * Check if current user has a specific role
   */
  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === role;
  }

  /**
   * Check if current user has any of the provided roles
   */
  hasAnyRole(roles: string[]): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser ? roles.includes(currentUser.role) : false;
  }

  private persistSession(user: User, token: string): void {
    const session: StoredSession = { user, token };
    localStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  getAccessToken(): string | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'token' in parsed) {
        return parsed.token || null;
      }
      return null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private extractUserPayload(response: ApiResponse<UserResponse> | UserResponse): UserResponse {
    if ('success' in response) {
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user profile');
      }
      return response.data;
    }
    return response;
  }

  private clearSession(): void {
    localStorage.removeItem(this.storageKey);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if ('user' in parsed && parsed.user) {
          return parsed.user as User;
        }
        if ('userID' in parsed && 'email' in parsed) {
          return parsed as User;
        }
      }
      return null;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }

  private createMockUser(credentials: LoginCredentials): User {
    const roleByEmail: Record<string, UserRole> = {
      'student@safeschool.com': 'student',
      'parent@safeschool.com': 'parent',
      'teacher@safeschool.com': 'teacher',
      'officer@safeschool.com': 'safety_officer',
      'admin@safeschool.com': 'admin',
      'auditor@safeschool.com': 'auditor',
      'compliance@safeschool.com': 'compliance_officer',
    };

    const role = (roleByEmail[credentials.email.toLowerCase()] || 'student') as UserRole;
    return {
      userID: credentials.email,
      name: 'Demo User',
      role,
      email: credentials.email,
      phone: '+1234567890',
      status: 'active',
    };
  }
}
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { User } from '../../store/models';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private store = inject(AppStore);

  /**
   * Fetch all users
   * TODO: Replace with actual HTTP call to backend
   */
  getUsers(): Observable<User[]> {
    this.store.setLoading(true);
    return of([]).pipe(
      delay(1000),
      tap((users) => {
        this.store.setUsers(users);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Fetch user by ID
   * TODO: Replace with actual HTTP call to backend
   */
  getUserById(userID: string): Observable<User | undefined> {
    return of(this.store.users().find((u) => u.userID === userID));
  }

  /**
   * Create new user
   * TODO: Replace with actual HTTP call to backend
   */
  createUser(user: User): Observable<User> {
    this.store.setLoading(true);
    return of(user).pipe(
      delay(500),
      tap((newUser) => {
        this.store.addUser(newUser);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Update user
   * TODO: Replace with actual HTTP call to backend
   */
  updateUser(user: User): Observable<User> {
    this.store.setLoading(true);
    return of(user).pipe(
      delay(500),
      tap((updatedUser) => {
        this.store.updateUser(updatedUser);
        this.store.setLoading(false);
      })
    );
  }

  /**
   * Delete user
   * TODO: Replace with actual HTTP call to backend
   */
  deleteUser(userID: string): Observable<void> {
    this.store.setLoading(true);
    return of(void 0).pipe(
      delay(500),
      tap(() => {
        this.store.deleteUser(userID);
        this.store.setLoading(false);
      })
    );
  }
}

import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../models';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.currentUser
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isAuthenticated
);

export const selectAuthIsLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectHasRole = (role: string) =>
  createSelector(
    selectCurrentUser,
    (user) => user?.role === role
  );

export const selectHasAnyRole = (roles: string[]) =>
  createSelector(
    selectCurrentUser,
    (user) => user ? roles.includes(user.role) : false
  );

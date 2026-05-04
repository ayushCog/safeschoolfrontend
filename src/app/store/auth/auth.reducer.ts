import { createReducer, on } from '@ngrx/store';
import { User, AuthState } from '../models';
import * as AuthActions from './auth.actions';

export const initialAuthState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.signup, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(AuthActions.signupSuccess, (state) => ({
    ...state,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.restoreSessionSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    isAuthenticated: true,
    isLoading: false,
    error: null,
  })),
  on(AuthActions.restoreSessionFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(AuthActions.clearAuthError, (state) => ({
    ...state,
    error: null,
  }))
);

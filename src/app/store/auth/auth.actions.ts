import { createAction, props } from '@ngrx/store';
import { User, LoginCredentials, SignupUserData } from '../models';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginCredentials }>()
);

export const signup = createAction(
  '[Auth] Signup',
  props<{ userData: SignupUserData }>()
);

export const signupSuccess = createAction(
  '[Auth] Signup Success'
);

export const signupFailure = createAction(
  '[Auth] Signup Failure',
  props<{ error: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction(
  '[Auth] Logout'
);

export const logoutSuccess = createAction(
  '[Auth] Logout Success'
);

export const restoreSession = createAction(
  '[Auth] Restore Session'
);

export const restoreSessionSuccess = createAction(
  '[Auth] Restore Session Success',
  props<{ user: User }>()
);

export const restoreSessionFailure = createAction(
  '[Auth] Restore Session Failure',
  props<{ error: string }>()
);

export const clearAuthError = createAction(
  '[Auth] Clear Error'
);

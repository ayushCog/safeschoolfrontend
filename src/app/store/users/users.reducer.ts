import { createReducer, on } from '@ngrx/store';
import { User } from '../models';
import * as UsersActions from './users.actions';

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    isLoading: false,
  })),
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(UsersActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
  })),
  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.userID === user.userID ? user : u)),
  })),
  on(UsersActions.deleteUserSuccess, (state, { userID }) => ({
    ...state,
    users: state.users.filter((u) => u.userID !== userID),
  }))
);

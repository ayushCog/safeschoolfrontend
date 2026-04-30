import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.users
);

export const selectUserById = (id: string) =>
  createSelector(
    selectAllUsers,
    (users) => users.find((u) => u.userID === id)
  );

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state: UsersState) => state.isLoading
);

export const selectActiveUsers = createSelector(
  selectAllUsers,
  (users) => users.filter((u) => u.status === 'active')
);

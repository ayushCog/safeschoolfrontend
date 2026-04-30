import { createSelector, createFeatureSelector } from '@ngrx/store';
import { NotificationsState } from './notifications.reducer';

export const selectNotificationsState = createFeatureSelector<NotificationsState>('notifications');

export const selectAllNotifications = createSelector(
  selectNotificationsState,
  (state) => state.notifications
);

export const selectUnreadNotifications = createSelector(
  selectAllNotifications,
  (notifications) => notifications.filter((n) => n.status === 'unread')
);

export const selectUnreadCount = createSelector(
  selectUnreadNotifications,
  (notifications) => notifications.length
);

export const selectNotificationsLoading = createSelector(
  selectNotificationsState,
  (state) => state.isLoading
);

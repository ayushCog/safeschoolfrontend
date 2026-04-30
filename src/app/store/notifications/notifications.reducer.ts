import { createReducer, on } from '@ngrx/store';
import { Notification } from '../models';
import * as NotificationsActions from './notifications.actions';

export interface NotificationsState {
  notifications: Notification[];
  isLoading: boolean;
}

export const initialNotificationsState: NotificationsState = {
  notifications: [],
  isLoading: false,
};

export const notificationsReducer = createReducer(
  initialNotificationsState,
  on(NotificationsActions.loadNotifications, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(NotificationsActions.loadNotificationsSuccess, (state, { notifications }) => ({
    ...state,
    notifications,
    isLoading: false,
  })),
  on(NotificationsActions.addNotification, (state, { notification }) => ({
    ...state,
    notifications: [notification, ...state.notifications],
  })),
  on(NotificationsActions.markAsReadSuccess, (state, { notificationID }) => ({
    ...state,
    notifications: state.notifications.map((n) =>
      n.notificationID === notificationID ? { ...n, status: 'read' as const } : n
    ),
  })),
  on(NotificationsActions.deleteNotificationSuccess, (state, { notificationID }) => ({
    ...state,
    notifications: state.notifications.filter((n) => n.notificationID !== notificationID),
  }))
);

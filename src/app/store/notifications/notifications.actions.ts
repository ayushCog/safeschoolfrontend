import { createAction, props } from '@ngrx/store';
import { Notification } from '../models';

export const loadNotifications = createAction('[Notifications] Load');

export const loadNotificationsSuccess = createAction(
  '[Notifications] Load Success',
  props<{ notifications: Notification[] }>()
);

export const addNotification = createAction(
  '[Notifications] Add',
  props<{ notification: Notification }>()
);

export const markAsRead = createAction(
  '[Notifications] Mark As Read',
  props<{ notificationID: string }>()
);

export const markAsReadSuccess = createAction(
  '[Notifications] Mark As Read Success',
  props<{ notificationID: string }>()
);

export const deleteNotification = createAction(
  '[Notifications] Delete',
  props<{ notificationID: string }>()
);

export const deleteNotificationSuccess = createAction(
  '[Notifications] Delete Success',
  props<{ notificationID: string }>()
);

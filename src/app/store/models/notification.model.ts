export type NotificationCategory =
  | 'incident'
  | 'training'
  | 'alert'
  | 'reminder'
  | 'compliance'
  | 'system';

export type NotificationStatus = 'unread' | 'read' | 'archived' | 'deleted';

export interface Notification {
  notificationID: string;
  userID: string;
  entityID: string;
  message: string;
  category: NotificationCategory;
  status: NotificationStatus;
  createdDate: string;
  readDate?: string;
  actionLink?: string;
}

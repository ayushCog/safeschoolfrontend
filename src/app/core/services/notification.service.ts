import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { AppStore } from '../../store/app.store';
import { Notification } from '../../store/models';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private store = inject(AppStore);

  /**
   * Fetch all notifications
   * TODO: Replace with actual HTTP call to backend
   */
  getNotifications(): Observable<Notification[]> {
    return of(this.store.notifications());
  }

  /**
   * Fetch unread notifications for current user
   */
  getUnreadNotifications(): Observable<Notification[]> {
    return of(this.store.unreadNotifications());
  }

  /**
   * Create new notification
   * TODO: Replace with actual HTTP call to backend
   */
  createNotification(notification: Notification): Observable<Notification> {
    return of(notification).pipe(
      delay(300),
      tap((newNotification) => {
        this.store.addNotification(newNotification);
      })
    );
  }

  /**
   * Mark notification as read
   * TODO: Replace with actual HTTP call to backend
   */
  markAsRead(notificationID: string): Observable<void> {
    return of(void 0).pipe(
      delay(200),
      tap(() => {
        this.store.markNotificationAsRead(notificationID);
      })
    );
  }

  /**
   * Delete notification
   * TODO: Replace with actual HTTP call to backend
   */
  deleteNotification(notificationID: string): Observable<void> {
    return of(void 0).pipe(
      delay(200),
      tap(() => {
        this.store.deleteNotification(notificationID);
      })
    );
  }

  /**
   * Get unread notification count
   */
  getUnreadCount(): number {
    return this.store.unreadNotificationCount();
  }
}

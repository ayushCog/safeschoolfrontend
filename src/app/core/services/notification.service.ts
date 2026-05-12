import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Notification } from '../../store/models';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { getApiResponseMessage } from './api-response.util';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly baseUrl = 'http://localhost:8081';
  private http = inject(HttpClient);

  getUnreadNotifications(userId: string): Observable<Notification[]> {
    return this.http
      .get<ApiResponse<Notification[]>>(
        `${this.baseUrl}/notification/allnotifications/${userId}`
      )
      .pipe(
        tap((response) => console.log('Notification API response:', response)),
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to load notifications'));
          }
          // Map backend fields to frontend interface
          const mappedNotifications = response.data.map((item: any) => ({
            notificationID: item.notificationId || item.notificationID,
            userID: item.userId || item.userID,
            entityID: item.entityId || item.entityID,
            message: item.message,
            category: item.category,
            status: (item.status || '').toLowerCase(), // Normalize status to lowercase
            createdDate: item.createdDate,
            readDate: item.readDate,
            actionLink: item.actionLink,
          }));
          console.log('Mapped notifications:', mappedNotifications);
          return mappedNotifications;
        })
      );
  }

  markAsRead(userId: string, notificationId: string): Observable<string> {
    return this.http
      .patch<ApiResponse<string>>(
        `${this.baseUrl}/notification/mark-read/${userId}/${notificationId}`,
        null
      )
      .pipe(
        map((response) => {
          if (!response.success) {
            throw new Error(getApiResponseMessage(response, 'Failed to mark notification as read'));
          }
          return response.data;
        })
      );
  }

  getNotifications(): Observable<Notification[]> {
    return of([]);
  }

  createNotification(notification: Notification): Observable<Notification> {
    return of(notification).pipe(delay(300));
  }
}

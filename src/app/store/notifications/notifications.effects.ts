import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification.service';
import * as NotificationsActions from './notifications.actions';

@Injectable()
export class NotificationsEffects {
  private actions$ = inject(Actions);
  private notificationService = inject(NotificationService);

  loadNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.loadNotifications),
      switchMap(() =>
        this.notificationService.getNotifications().pipe(
          map((notifications) =>
            NotificationsActions.loadNotificationsSuccess({ notifications })
          ),
          catchError(() => of({ type: '[Notifications] Load Error' }))
        )
      )
    )
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.markAsRead),
      switchMap(({ notificationID }) =>
        this.notificationService.markAsRead(notificationID).pipe(
          map(() =>
            NotificationsActions.markAsReadSuccess({ notificationID })
          ),
          catchError(() => of({ type: '[Notifications] Mark As Read Error' }))
        )
      )
    )
  );

  deleteNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NotificationsActions.deleteNotification),
      switchMap(({ notificationID }) =>
        this.notificationService.deleteNotification(notificationID).pipe(
          map(() =>
            NotificationsActions.deleteNotificationSuccess({ notificationID })
          ),
          catchError(() => of({ type: '[Notifications] Delete Error' }))
        )
      )
    )
  );
}

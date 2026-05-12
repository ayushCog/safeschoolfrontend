import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { selectStudentNotifications } from '../../store/student-portal/student-portal.selectors';
import { loadStudentNotifications, markStudentNotificationRead } from '../../store/student-portal/student-portal.actions';
import { Notification, User } from '../../store/models';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent],
  templateUrl: './student-portal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentPortalComponent implements OnInit {
  private router = inject(Router);
  private store = inject(Store);

  currentUser$ = this.store.select(selectCurrentUser);
  studentNotifications$: Observable<Notification[]> = this.store.select(selectStudentNotifications);
  notificationCount$ = this.studentNotifications$.pipe(
    map((notifications) => notifications.filter((notification) => notification.status === 'unread').length)
  );

  ngOnInit(): void {
    this.store.dispatch(loadStudentNotifications());
    this.studentNotifications$.subscribe(notifications => {
      console.log('Student notifications in component:', notifications);
    });
    this.notificationCount$.subscribe(count => {
      console.log('Notification count:', count);
    });
  }

  logout(): void {
    this.router.navigate(['/auth/logout']);
  }

  onNotificationRead(notificationId: string): void {
    this.currentUser$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.store.dispatch(markStudentNotificationRead({ userId: user.userID, notificationId }));
      }
    });
  }
}
import { Component, input, output, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Notification } from '../../../store/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  applicationTitle = input<string>('Safe School');
  userName = input<string | null>(null);
  notificationCount = input<number>(0);
  notificationItems = input<Notification[]>([]);
  logoutClicked = output<void>();
  notificationRead = output<string>();
  notificationOpen = signal(false);

  constructor() {
    // Log when inputs change
    effect(() => {
      console.log('Navbar notificationItems:', this.notificationItems());
      console.log('Navbar notificationCount:', this.notificationCount());
    });
  }

  toggleNotifications(): void {
    this.notificationOpen.set(!this.notificationOpen());
  }

  markAsRead(notificationId: string): void {
    this.notificationRead.emit(notificationId);
  }

  onLogout(): void {
    this.logoutClicked.emit();
  }
}

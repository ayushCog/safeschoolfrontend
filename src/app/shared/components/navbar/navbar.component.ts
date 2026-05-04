import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  applicationTitle = input<string>('Safe School');
  userName = input<string | null>(null);
  notificationCount = input<number>(0);
  logoutClicked = output<void>();

  onLogout(): void {
    this.logoutClicked.emit();
  }
}

import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="navbar" role="banner">
      <div class="navbar-content">
        <div class="logo">
          <h1>{{ applicationTitle() }}</h1>
        </div>

        <div class="navbar-center">
          @if (userName()) {
            <span class="user-info">Welcome, {{ userName() }}</span>
          }
        </div>

        <nav class="navbar-actions" role="navigation" aria-label="User actions">
          <button class="nav-button logout" (click)="onLogout()" aria-label="Logout">
            ✕ Logout
          </button>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      background-color: #1f2937;
      color: #f3f4f6;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 100%;
    }

    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .navbar-center {
      flex: 1;
      text-align: center;
      margin: 0 1rem;
    }

    .user-info {
      font-size: 0.875rem;
    }

    .navbar-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .nav-button {
      background-color: #374151;
      border: none;
      color: #f3f4f6;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
    }

    .nav-button:hover {
      background-color: #4b5563;
    }

    .nav-button.logout:hover {
      background-color: #ef4444;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      background-color: #ef4444;
      color: white;
      border-radius: 50%;
      font-size: 0.75rem;
      font-weight: 700;
      position: absolute;
      top: -0.5rem;
      right: -0.5rem;
    }
  `],
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

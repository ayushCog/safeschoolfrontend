import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { User } from '../../store/models';

@Component({
  selector: 'app-staff-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar
      applicationTitle="Safe School Staff Portal"
      [userName]="(currentUser$ | async)?.name || 'Staff Member'"
      [notificationCount]="3"
      (logoutClicked)="logout()"
    ></app-navbar>

    <div class="p-6">
      <p class="text-gray-600 mb-6">
        Unified dashboard for incident management, training, and compliance tracking.
      </p>

      <nav class="mb-6 flex flex-wrap gap-3">
        <a routerLink="console" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Dashboard</a>
        <a routerLink="log-incident" class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Log Incident</a>
        <a routerLink="manage-incidents" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Manage Incidents</a>
        <a routerLink="trainings" class="px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700">Trainings</a>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffPortalComponent {
  private router = inject(Router);
  private store = inject(Store);

  currentUser$ = this.store.select(selectCurrentUser);

  logout(): void {
    this.router.navigate(['/auth/logout']);
  }
}

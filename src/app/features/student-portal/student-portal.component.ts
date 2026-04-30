import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { selectCurrentUser } from '../../store/auth/auth.selectors';
import { User } from '../../store/models';

@Component({
  selector: 'app-student-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar
      applicationTitle="Safe School"
      [userName]="(currentUser$ | async)?.name || 'Student'"
      (logoutClicked)="logout()"
    ></app-navbar>

    <div class="p-6">
      <p class="text-gray-600 mb-6">
        Welcome to your student safety dashboard. Report incidents.
      </p>

      <nav class="mb-6 flex flex-wrap gap-3">
        <a routerLink="report-incident" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Report Incident</a>
        <a routerLink="my-reports" class="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700">My Reports</a>
      </nav>

      <router-outlet></router-outlet>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentPortalComponent {
  private router = inject(Router);
  private store = inject(Store);

  currentUser$ = this.store.select(selectCurrentUser);

  logout(): void {
    this.router.navigate(['/auth/logout']);
  }
}

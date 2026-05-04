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
  templateUrl: './staff-portal.component.html',
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

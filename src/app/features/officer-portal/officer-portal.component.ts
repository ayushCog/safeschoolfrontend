import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AppStore } from '../../store/app.store';
import { NavbarComponent } from '../../shared/components';
import { selectCurrentUser } from '../../store/auth';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-officer-portal',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './officer-portal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficerPortalComponent {
    router = inject(Router);
    store = inject(Store);
    currentUser$ = this.store.select(selectCurrentUser);

    ngOnInit(): void {
        console.log(this.currentUser$);
    }

    logout(): void {
        this.router.navigate(['/auth/logout']);
    }
}

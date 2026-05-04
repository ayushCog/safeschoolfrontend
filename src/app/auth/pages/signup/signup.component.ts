import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthIsLoading } from '../../../store/auth/auth.selectors';
import { signup } from '../../../store/auth/auth.actions';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { UserRole } from '../../../store/models';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './signup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {
  private store = inject(Store);
  private router = inject(Router);

  name = signal('');
  email = signal('');
  phone = signal('');
  role = signal('');
  password = signal('');
  confirmPassword = signal('');

  isLoading$ = this.store.select(selectAuthIsLoading);
  errorMessage$ = this.store.select(selectAuthError);

  isFormValid(): boolean {
    return !!(
      this.name().trim() &&
      this.email().trim() &&
      this.phone().trim() &&
      this.role() &&
      this.password() &&
      this.confirmPassword() &&
      this.password() === this.confirmPassword()
    );
  }

  onSignup(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.store.dispatch(
      signup({
        userData: {
          name: this.name().trim(),
          email: this.email().trim(),
          phone: this.phone().trim(),
          role: this.role() as UserRole,
          password: this.password(),
        },
      })
    );
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
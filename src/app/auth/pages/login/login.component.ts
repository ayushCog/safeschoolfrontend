import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthIsLoading } from '../../../store/auth/auth.selectors';
import { login } from '../../../store/auth/auth.actions';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private store = inject(Store);
  private router = inject(Router);

  email = signal('');
  password = signal('');

  isLoading$ = this.store.select(selectAuthIsLoading);
  errorMessage$ = this.store.select(selectAuthError);

  demoUsers = signal([
    { role: 'student', email: 'student@safeschool.com' },
    { role: 'parent', email: 'parent@safeschool.com' },
    { role: 'teacher', email: 'teacher@safeschool.com' },
    { role: 'safety_officer', email: 'officer@safeschool.com' },
    { role: 'admin', email: 'admin@safeschool.com' },
  ]);

  onLogin(): void {
    if (!this.email() || !this.password()) {
      return;
    }

    this.store.dispatch(
      login({
        credentials: { email: this.email(), password: this.password() },
      })
    );
  }

  goToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }
}
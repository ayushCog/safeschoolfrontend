import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectAuthError, selectAuthIsLoading } from '../../../store/auth/auth.selectors';
import { login } from '../../../store/auth/auth.actions';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div class="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Safe School</h1>
        <h2 class="text-sm text-center text-gray-600 mb-8">School Safety Management System</h2>

        <form (ngSubmit)="onLogin()" class="space-y-4">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              [(ngModel)]="email" 
              placeholder="Enter your email"
              required
              class="form-input"
              aria-label="Email address"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              [(ngModel)]="password"
              placeholder="Enter your password"
              required
              class="form-input"
              aria-label="Password"
            />
          </div>

          @if (errorMessage$ | async; as error) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded" role="alert">
              ⚠️ {{ error }}
            </div>
          }

          <app-button
            label="Sign In"
            variant="primary"
            [isDisabled]="(isLoading$ | async) || false"
            buttonType="submit"
          />
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private store = inject(Store);

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
}
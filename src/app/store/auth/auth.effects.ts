import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService as AuthApiService } from '../../core/services/auth.service';
import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthApiService);
  private router = inject(Router);
  private store = inject(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user }) => {
          const roleRoutes: { [key: string]: string } = {
            'STUDENT': '/student',
            'ROLE_STUDENT': '/student',
            'student': '/student',
            'Teacher': '/staff',
            'teacher': '/staff',
            'Staff': '/staff',
            'staff': '/staff',
            'Safety Officer': '/staff',
            'safety_officer': '/staff',
            'Admin': '/staff',
            'admin': '/staff',
            'ADMIN': '/staff',
            'ROLE_ADMIN': '/staff'
          };
          this.router.navigate([roleRoutes[user.role] || '/student']);
        })
      ),
    { dispatch: false }
  );

  restoreSession$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ROOT_EFFECTS_INIT),
        map(() => this.authService.restoreSession()),
        tap((user) => {
          if (user) {
            this.store.dispatch(AuthActions.restoreSessionSuccess({ user }));
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError((error) =>
            of(AuthActions.logoutSuccess())
          )
        )
      )
    )
  );

  logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.router.navigate(['/auth/login']))
      ),
    { dispatch: false }
  );
}

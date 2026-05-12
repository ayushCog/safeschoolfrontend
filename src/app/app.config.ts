import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { authReducer } from './store/auth/auth.reducer';
import { incidentsReducer } from './store/incidents/incidents.reducer';
import { usersReducer } from './store/users/users.reducer';
import { programsReducer } from './store/programs/programs.reducer';
import { dashboardReducer } from './store/dashboard/dashboard.reducer';
import { studentPortalReducer } from './store/student-portal/student-portal.reducer';
import { staffPortalReducer } from './store/staff-portal/staff-portal.reducer';

import { AuthEffects } from './store/auth/auth.effects';
import { IncidentsEffects } from './store/incidents/incidents.effects';
import { UsersEffects } from './store/users/users.effects';
import { ProgramsEffects } from './store/programs/programs.effects';
import { DashboardEffects } from './store/dashboard/dashboard.effects';
import { StudentPortalEffects } from './store/student-portal/student-portal.effects';
import { StaffPortalEffects } from './store/staff-portal/staff-portal.effects';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),

    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },

    provideStore(
      {
        auth: authReducer,
        incidents: incidentsReducer,
        users: usersReducer,
        programs: programsReducer,
        dashboard: dashboardReducer,
        studentPortal: studentPortalReducer,
        staffPortal: staffPortalReducer,
      },
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictActionWithinNgZone: false,
          strictActionTypeUniqueness: false,
        },
      }
    ),

    provideEffects([
      AuthEffects,
      IncidentsEffects,
      UsersEffects,
      ProgramsEffects,
      DashboardEffects,
      StudentPortalEffects,
      StaffPortalEffects,
    ]),

    provideStoreDevtools({
      maxAge: 25,
      logOnly: true,
    }),
  ],
};
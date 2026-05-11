import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';
import { STUDENT_PORTAL_ROUTES } from './features/student-portal/student-portal.routes';
import { STAFF_PORTAL_ROUTES } from './features/staff-console/staff-portal.routes';
import { COMPLIANCE_OFFICER_ROUTES } from './features/compliance-officer/compliance-officer.routes';
import { OFFICER_PORTAL_ROUTES } from './features/officer-portal/officer-portal.routes';
import { AUTH_ROUTES } from './auth/auth.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: 'officer',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['officer'] },
    loadComponent: () =>
      import('./features/officer-portal/officer-portal.component').then(
        (m) => m.OfficerPortalComponent
      ),
    children: OFFICER_PORTAL_ROUTES,
  },
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['student', 'parent'] },
    children: STUDENT_PORTAL_ROUTES,
  },
  {
    path: 'staff',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['teacher', 'staff', 'safety_officer', 'admin'] },
    children: STAFF_PORTAL_ROUTES,
  },
  {
    path: 'compliance',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['compliance_officer'] },
    children: COMPLIANCE_OFFICER_ROUTES,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

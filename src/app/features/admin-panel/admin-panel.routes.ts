import { Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';

export const ADMIN_PANEL_ROUTES: Routes = [
  {
    path: '',
    component: AdminPanelComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'users',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/users/users.component').then(
            (m) => m.UsersComponent
          ),
      },
      {
        path: 'programs',
        loadComponent: () =>
          import('./pages/programs/programs.component').then(
            (m) => m.ProgramsComponent
          ),
      },
      {
        path: 'staff-management',
        loadComponent: () =>
          import('./pages/staff-management/staff-management.component').then(
            (m) => m.StaffManagementComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./pages/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
      },
    ],
  },
];

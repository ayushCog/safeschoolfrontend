import { Routes } from '@angular/router';

export const STAFF_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./staff-portal.component').then((m) => m.StaffPortalComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'console',
      },
      {
        path: 'console',
        loadComponent: () =>
          import('./staff-console.component').then((m) => m.StaffConsoleComponent),
      },
      {
        path: 'log-incident',
        loadComponent: () =>
          import('./pages/log-incident/log-incident.component').then(
            (m) => m.LogIncidentComponent
          ),
      },
      {
        path: 'manage-incidents',
        loadComponent: () =>
          import('./pages/manage-incidents/manage-incidents.component').then(
            (m) => m.ManageIncidentsComponent
          ),
      },
      {
        path: 'trainings',
        loadComponent: () =>
          import('./pages/trainings/trainings.component').then(
            (m) => m.TrainingsComponent
          ),
      },
    ],
  },
];

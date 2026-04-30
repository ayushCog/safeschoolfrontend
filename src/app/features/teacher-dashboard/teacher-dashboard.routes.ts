import { Routes } from '@angular/router';

export const TEACHER_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./teacher-dashboard.component').then(
        (m) => m.TeacherDashboardComponent
      ),
    children: [
      {
        path: 'log-incident',
        loadComponent: () =>
          import('./pages/log-incident/log-incident.component').then(
            (m) => m.LogIncidentComponent
          ),
      },
      {
        path: 'my-trainings',
        loadComponent: () =>
          import('./pages/my-trainings/my-trainings.component').then(
            (m) => m.MyTrainingsComponent
          ),
      },
      {
        path: 'compliance-status',
        loadComponent: () =>
          import('./pages/compliance-status/compliance-status.component').then(
            (m) => m.ComplianceStatusComponent
          ),
      },
    ],
  },
];

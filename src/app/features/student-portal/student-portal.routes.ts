import { Routes } from '@angular/router';

export const STUDENT_PORTAL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./student-portal.component').then(
        (m) => m.StudentPortalComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'report-incident',
      },
      {
        path: 'report-incident',
        loadComponent: () =>
          import('./pages/report-incident/report-incident.component').then(
            (m) => m.ReportIncidentComponent
          ),
      },
      {
        path: 'my-reports',
        loadComponent: () =>
          import('./pages/my-reports/my-reports.component').then(
            (m) => m.MyReportsComponent
          ),
      },
    ],
  },
];

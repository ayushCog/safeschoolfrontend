import { Routes } from '@angular/router';

export const AUDITOR_DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auditor-dashboard.component').then(
        (m) => m.AuditorDashboardComponent
      ),
    // children: [
    //   {
    //     path: 'safety-review',
    //     loadComponent: () =>
    //       import('./pages/safety-review/safety-review.component').then(
    //         (m) => m.SafetyReviewComponent
    //       ),
    //   },
    //   {
    //     path: 'compliance-monitoring',
    //     loadComponent: () =>
    //       import('./pages/compliance-monitoring/compliance-monitoring.component').then(
    //         (m) => m.ComplianceMonitoringComponent
    //       ),
    //   },
    // ],
  },
];

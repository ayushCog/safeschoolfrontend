import { Routes } from '@angular/router';

export const COMPLIANCE_OFFICER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./compliance-officer.component').then(
        (m) => m.ComplianceOfficerComponent
      ),
    // children: [
    //   {
    //     path: 'policies',
    //     loadComponent: () =>
    //       import('./pages/policies/policies.component').then(
    //         (m) => m.PoliciesComponent
    //       ),
    //   },
    //   {
    //     path: 'audits',
    //     loadComponent: () =>
    //       import('./pages/audits/audits.component').then(
    //         (m) => m.AuditsComponent
    //       ),
    //   },
    //   {
    //     path: 'compliance-reports',
    //     loadComponent: () =>
    //       import('./pages/compliance-reports/compliance-reports.component').then(
    //         (m) => m.ComplianceReportsComponent
    //       ),
    //   },
    // ],
  },
];

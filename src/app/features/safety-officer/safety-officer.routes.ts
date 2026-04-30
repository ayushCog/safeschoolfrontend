import { Routes } from '@angular/router';

export const SAFETY_OFFICER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./safety-officer.component').then(
        (m) => m.SafetyOfficerComponent
      ),
    children: [
      {
        path: 'incidents',
        loadComponent: () =>
          import('./pages/incidents/incidents.component').then(
            (m) => m.IncidentsComponent
          ),
      },
      {
        path: 'incident/:id/resolve',
        loadComponent: () =>
          import('./pages/resolve-incident/resolve-incident.component').then(
            (m) => m.ResolveIncidentComponent
          ),
      },
      {
        path: 'drills',
        loadComponent: () =>
          import('./pages/drills/drills.component').then(
            (m) => m.DrillsComponent
          ),
      },
    ],
  },
];

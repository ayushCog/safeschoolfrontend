import { Routes } from '@angular/router';

export const OFFICER_PORTAL_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'incidents'
  },
  {
    path: 'incidents',
    loadComponent: () =>
      import('./pages/officer-incidents/officer-incidents.component').then(
        (m) => m.OfficerIncidentsComponent
      ),
  },
  {
    path: 'programs',
    loadComponent: () =>
      import('./pages/officer-programs/officer-programs.component').then(
        (m) => m.OfficerProgramsComponent
      ),
  },
];

import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => import('./stemwijzer-page/stemwijzer-page.component')
      .then(module => module.StemwijzerPageComponent),
    title: 'StemWijzer | Stellingen',
  },
  {
    path: '**',
    redirectTo: '',
  },
];

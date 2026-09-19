import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => import('./register-page.component').then(module => module.RegisterPageComponent),
  },
];

import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadChildren: async () => import('./login-page/login-page.routes').then(module => module.routes),
  },
  {
    path: 'register',
    loadChildren: async () => import('./register-page/register-page.routes').then(module => module.routes),
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

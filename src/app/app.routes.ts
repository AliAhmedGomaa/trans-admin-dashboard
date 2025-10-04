import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/bookings',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./core/auth/auth.routes').then((m) => m.AuthRoutes),
  },
  {
    path: '',
    loadComponent: () =>
      import('./core/nav/nav.component').then((m) => m.NavComponent),
    canActivate: [authGuard],
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./pages/bookings/bookings.routes').then((m) => m.BookingsRoutes),
  },
  {
    path: 'offices',
    loadChildren: () =>
      import('./pages/offices/offices.routes').then((m) => m.OfficesRoutes),
  },
  {
    path: 'cars',
    loadChildren: () =>
      import('./pages/cars/cars.routes').then((m) => m.CarsRoutes),
  },

  {
    path: '**',
    redirectTo: '/bookings',
  },
];

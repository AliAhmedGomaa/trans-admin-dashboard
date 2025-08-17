import { Routes } from '@angular/router';
import { NavComponent } from './core/nav/nav.component';
import { BookingsComponent } from './pages/bookings/bookings.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'bookings' },
      { path: 'bookings', component: BookingsComponent },
    ],
  },
];



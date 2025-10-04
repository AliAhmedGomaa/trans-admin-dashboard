import { Routes } from '@angular/router';
import { BookingsComponent } from './bookings.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';
import { authGuard } from 'src/app/core/auth/guards/auth.guard';

export const BookingsRoutes: Routes = [
  {
    path: '',
    component: BookingsComponent,
    canActivate: [authGuard],
  },
  {
    path: ':id',
    component: BookingDetailsComponent,
    canActivate: [authGuard],
  }
];



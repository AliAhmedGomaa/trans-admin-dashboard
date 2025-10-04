import { Routes } from '@angular/router';
import { CarsComponent } from './cars.component';
import { CarDetailsComponent } from './car-details/car-details.component';
import { CarCreateComponent } from './car-create/car-create.component';
import { authGuard } from 'src/app/core/auth/guards/auth.guard';

export const CarsRoutes: Routes = [
  { path: '', component: CarsComponent, canActivate: [authGuard] },
  { path: 'create', component: CarCreateComponent, canActivate: [authGuard] },
  { path: ':id/edit', component: CarCreateComponent, canActivate: [authGuard] },
  { path: ':id', component: CarDetailsComponent, canActivate: [authGuard] },
];

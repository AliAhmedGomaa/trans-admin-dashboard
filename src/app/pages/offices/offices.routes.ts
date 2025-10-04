import { Routes } from '@angular/router';
import { OfficeDetailsComponent } from './office-details/office-details.component';
import { OfficeCreateComponent } from './office-create/office-create.component';
import { OfficesComponent } from './offices.component';
import { authGuard } from 'src/app/core/auth/guards/auth.guard';

export const OfficesRoutes: Routes = [
  { path: '', component: OfficesComponent, canActivate: [authGuard] },
  { path: 'create', component: OfficeCreateComponent, canActivate: [authGuard] },
  { path: ':id/edit', component: OfficeCreateComponent, canActivate: [authGuard] },
  { path: ':id', component: OfficeDetailsComponent, canActivate: [authGuard] },
];



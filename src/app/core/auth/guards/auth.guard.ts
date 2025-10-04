import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    router.navigate(['/auth/login'], { queryParams: { redirectTo: state.url } });
    return false;
  }
  return true;
};



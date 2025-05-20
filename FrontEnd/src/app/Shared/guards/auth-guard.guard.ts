import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenDecodeService } from '../services/token-decode.service';


export const authGuard: CanActivateFn = (route, state) => {
  const routes = inject(Router);
  const service = inject(TokenDecodeService);

  let isLoggedIn = service.isLoggedIn();
  if (!isLoggedIn) {
    routes.navigate(['/login']);
    return false;
  }
  return true;
};

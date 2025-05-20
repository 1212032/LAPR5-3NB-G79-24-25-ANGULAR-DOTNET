import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenDecodeService } from '../services/token-decode.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const routes = inject(Router);
    const service = inject(TokenDecodeService);

    let expectedRole = route.data['expectedRole'];

    let role = service.getUserRole();

    if (role === expectedRole) {
        return true;
    } else {
        role = role.toLowerCase();
        if (role == '') {
            routes.navigate(['/patient']);

        } else {
            routes.navigate(['/' + role]);
        }
    }
    return role === expectedRole;
};

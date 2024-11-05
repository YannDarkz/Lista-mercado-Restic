import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {map, tap} from 'rxjs/operators';

export const canActivateGuard: CanActivateFn = (route, state) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        auth.loginWithRedirect(); // Redireciona para o login se o usuário não estiver autenticado
      }
    }),
    map((isAuthenticated) => isAuthenticated) // Retorna true ou false para o guard
  );

  // let isAuthenticated = false;
  // auth.isAuthenticated$.subscribe((isAuth) => (isAuthenticated = isAuth));

  // if(!isAuthenticated) {
  //   auth.loginWithRedirect();
  //   return false;
  // }

  // return true;
};

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideAuth0({
    domain: 'dev-82ubfpsnq80d4hsz.us.auth0.com',
    clientId: 'tJQiaQziikKvtbUCQtZGdYO2biLrXMP0',
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  }),]
};

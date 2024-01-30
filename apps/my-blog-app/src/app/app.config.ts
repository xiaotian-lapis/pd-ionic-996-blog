import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
      IonicModule.forRoot({
        mode: 'md',
      }),
    ),
    provideIonicAngular({}),
    provideAnimations(),
    provideStoreDevtools({ maxAge: 25 }),
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LcD5UMpAAAAAJD3mPyx98vfmiPylpUGUxAuwraC',
    },
  ],
};

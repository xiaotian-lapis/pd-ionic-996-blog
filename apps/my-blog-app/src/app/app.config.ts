import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideAnimations } from '@angular/platform-browser/animations';
import { IonicModule } from '@ionic/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(
      IonicModule.forRoot({
        mode: 'md',
      }),
    ),
    provideIonicAngular({}),
    provideAnimations()],
};

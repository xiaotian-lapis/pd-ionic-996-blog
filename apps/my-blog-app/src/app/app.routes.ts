import { Route } from '@angular/router';
import { BlogService } from '@pd-ionic/blog-service';
import { provideState } from '@ngrx/store';
import { BLOGS_STATE_NAME, PROFILE_STATE_NAME } from '@pd-ionic/shared-constants';
import { BlogEffects, blogReducer } from '@pd-ionic/blog-store';
import { provideEffects } from '@ngrx/effects';
import { ProfileService } from '@pd-ionic/profile-service';
import { ProfileEffects, profileReducer } from '@pd-ionic/profile-store';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  {
    path: '',
    providers: [
      BlogService,
      provideState({
        name: BLOGS_STATE_NAME,
        reducer: blogReducer
      }),
      provideEffects([BlogEffects])
    ],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.routes').then((m) => m.HOME_ROUTES)
      },
    ]
  },

  {
    path: 'profile',
    providers: [
      ProfileService,
      provideState({
        name: PROFILE_STATE_NAME,
        reducer: profileReducer
      }),
      provideEffects([ProfileEffects])
    ],
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.PROFILE_ROUTES)
  },
  {
    path: 'blog',
    loadChildren: () =>
      import('./blog/blog-content/blog-content.routes').then((m) => m.BLOG_CONTENT_ROUTES),
    providers: [
      BlogService,
      provideState({
        name: BLOGS_STATE_NAME,
        reducer: blogReducer
      }),
      provideEffects([BlogEffects])
    ],
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

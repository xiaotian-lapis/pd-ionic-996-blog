import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of } from 'rxjs';
import { selectProfilesViewStatus } from './profile.selector';
import { ProfileActions } from './profile.action';
import { ProfileService } from '@pd-ionic/profile-service';
import { IProfileState } from './profile.reducer';
import { equals } from '@pd-ionic/shared-utils';
import { ViewStatus } from '@pd-ionic/shared-constants';

@Injectable()
export class ProfileEffects {

  private readonly actions$ = inject(Actions);
  private readonly profileService = inject(ProfileService);
  private readonly store: Store<IProfileState> = inject(Store);

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      // select Initialized info from store to determine whether to load blog from backend api
      concatLatestFrom(() => this.store.select(selectProfilesViewStatus)),
      mergeMap(([_, viewStatus]) => {
        if (equals(viewStatus, ViewStatus.Reloading)) {
          console.log(
            'already initialized, dispatch loaded success with null in profile',
          );
          return of(ProfileActions.profileLoadedSuccess({ profile: null }));
        } else {
          console.log('not initialized, load profile from backend api');
          // not initialized, load blog from backend api
          return this.profileService.getProfile().pipe(
            map((profile) => {
              console.log('successful load profile: ', profile);
              return ProfileActions.profileLoadedSuccess({ profile });
            }),
            catchError((error: { message: string }) =>
              of(ProfileActions.profileLoadedError({ error })),
            ),
          );
        }
      }),
    ),
  );
}

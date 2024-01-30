import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { IProfile } from '@pd-ionic/shared-models';
import { ViewStatus } from '@pd-ionic/shared-constants';
import { ProfileActions } from './profile.action';
import { equals, isNil } from '@pd-ionic/shared-utils';


export interface IProfileState extends EntityState<IProfile> {
  error: any;
  viewStatus: ViewStatus;
}

export const adapter: EntityAdapter<IProfile> = createEntityAdapter();

export const initialState: IProfileState = adapter.getInitialState({
  error: null,
  viewStatus: ViewStatus.Initial,
});

export const profileReducer = createReducer(
  initialState,
  on(ProfileActions.loadProfile, (state) => {
    console.log('loadProfile action triggered');
    if (equals(state.viewStatus, ViewStatus.Initial)) {
      return { ...state, viewStatus: ViewStatus.Loading };
    } else {
      // if already initialized, just set view status to reloading,
      // and prevent loading from backend api
      return { ...state, viewStatus: ViewStatus.Reloading };
    }
  }),
  on(
    ProfileActions.updateProfile,
    (state, { id, name, email, bio, updatedTime }) => {
      console.log('updateProfile reducer triggered');
      console.log(state.entities);
      const changes = { name, email, bio, updatedTime };
      return adapter.updateOne({ id, changes }, state);
    },
  ),
  on(ProfileActions.profileLoadedSuccess, (state, { profile }) => {
    if (isNil(profile)) {
      // if incoming profile is null, just set loading state to false.
      console.log(
        'profileLoadedSuccess reducer triggered, and profile is null',
      );
      return { ...state, viewStatus: ViewStatus.Success };
    }
    console.log(
      'profileLoadedSuccess reducer triggered, and profile is not null',
    );
    return adapter.addOne(profile, {
      ...state,
      viewStatus: ViewStatus.Success,
    });
  }),
  on(ProfileActions.profileLoadedError, (state, { error }) => {
    console.log('profileLoadedError reducer triggered');
    return { ...state, error, viewStatus: ViewStatus.Failure };
  }),
);

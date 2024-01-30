import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { IProfile } from '@pd-ionic/shared-models';


export const ProfileActions = createActionGroup({
  source: 'Profile',
  events: {
    'Load Profile': emptyProps(),
    'Update Profile': props<IProfile>(),
    'Profile Loaded Success': props<{ profile: IProfile | null }>(),
    'Profile Loaded Error': props<{ error: { message: string } }>(),
  },
});

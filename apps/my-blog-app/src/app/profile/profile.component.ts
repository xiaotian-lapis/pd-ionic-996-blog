import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe, Location, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  IProfileState,
  ProfileActions,
  selectAllProfiles,
  selectProfileById,
  selectProfilesViewStatus
} from '@pd-ionic/profile-store';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProfile } from '@pd-ionic/shared-models';
import { Observable } from 'rxjs';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'pd-ionic-profile',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly location = inject(Location);
  private readonly profileStore = inject(Store<IProfileState>);
  viewStatus$ = this.profileStore.select(selectProfilesViewStatus);
  private readonly fb = inject(FormBuilder);
  profileForm = this.fb.group({
    name: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    bio: new FormControl<string | null>(''),
    password: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(8)],
      nonNullable: true,
    }),
    age: new FormControl<number>(0, {
      validators: [Validators.required, Validators.min(18)],
      nonNullable: true,
    }),
  });

  // temporary hard code profile id
  private profileId: string = '1';
  profile$: Observable<IProfile | undefined> = this.profileStore.select(
    selectProfileById(this.profileId),
  );

  ngOnInit(): void {
    // dispatch load action to load logs into store
    console.log('load profile');
    this.profileStore.dispatch(ProfileActions.loadProfile());
    console.log('load profile done');
    const profiles$ = this.profileStore.select(selectAllProfiles);
    console.log('select all profiles');
    profiles$.pipe().subscribe((profiles) => {
      if (profiles.length > 0) {
        // prefill form with profile
        this.profileForm.patchValue(profiles[0]);
        this.profileId = profiles[0].id;
        console.log(this.profileId);
      }
    });
  }

  onSubmit() {
    // debug show form value
    const formValue: IProfile = {
      id: this.profileId,
      name: this.profileForm.value.name ?? '',
      email: this.profileForm.value.email ?? '',
      bio: this.profileForm.value.bio ?? '',
      updatedTime: new Date(),
    };
    console.log(formValue);

    // update profile
    this.profileStore.dispatch(ProfileActions.updateProfile(formValue));
  }

  goBack() {
    this.location.back();
  }
}

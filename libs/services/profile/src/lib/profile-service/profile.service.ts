import { IProfile } from '@pd-ionic/shared-models';
import { from, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

@Injectable()
export class ProfileService {

  getProfile(): Observable<IProfile> {
    return from(this.fetchCurrentUser());
  }

  private async fetchCurrentUser() : Promise<IProfile> {
    try {
      const { username, userId, signInDetails } = await getCurrentUser();
      const userAttributes = await fetchUserAttributes();
      return {
        id: userId,
        name: userAttributes.name ? userAttributes.name : '',
        email: userAttributes.email ? userAttributes.email : '',
        bio: userAttributes['custom:bio'] ? userAttributes['custom:bio'] : '',
        updatedTime: userAttributes.updated_at ? new Date(userAttributes.updated_at) : new Date(),
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }
}

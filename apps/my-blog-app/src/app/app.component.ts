import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DummyHeaderComponent, FooterComponent, HeaderComponent } from '@pd-ionic/shared-ui';
import { IonicModule } from '@ionic/angular';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';
import { confirmSignIn, signIn, signUp } from 'aws-amplify/auth';
import { ISignUpParameters } from '@pd-ionic/shared-models';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    IonicModule,
    AmplifyAuthenticatorModule,
    RecaptchaV3Module,
    CommonModule,
    DummyHeaderComponent
  ],
  selector: 'pd-ionic-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'my-blog-app';

  private readonly recaptchaV3Service = inject(ReCaptchaV3Service);
  protected shouldShowPlaceholder: boolean = true;

  constructor() {
    Amplify.configure(awsExports);
  }

  flag = false;

  services = {
    handleSignUp: async (formData: Record<string, any>) => {
      const { username, password, email, name } = formData as ISignUpParameters;
      return await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            name,
            updated_at: new Date().toISOString(),
            'custom:bio': "new user's bio",
          },
          // optional
          autoSignIn: true // or SignInOptions e.g { authFlowType: "USER_SRP_AUTH" }
        }
      });
    },

    handleSignIn: async (formData: Record<string, any>) => {
      try {
        const { username, password } = formData;
        let signInOutput = await signIn({
          username,
          password,
          options: {
            authFlowType: 'CUSTOM_WITH_SRP'
          }
        });

        if (signInOutput.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
          const challengeResponse = await firstValueFrom(this.recaptchaV3Service.execute('login'));
          signInOutput = await this.handleRecaptchaConfirmSignIn(challengeResponse);
        }

        console.log('Sign In Success', signInOutput);
        this.shouldShowPlaceholder = false;
        return signInOutput;

      } catch (e) {
        console.log('Sign In Failed', e);
        this.flag = true;
        throw e;
      }
    }
  };

  protected async handleRecaptchaConfirmSignIn(event: any) {
    try {
      const confirmSignInOutput = await confirmSignIn({ challengeResponse: event });
      console.log('Confirm Sign In Success', confirmSignInOutput);
      return confirmSignInOutput;
    } catch (e) {
      console.log('Confirm Sign In Failed', e);
      this.flag = true;
      throw e;
    }
  }

  formFields = {
    signUp: {
      username: {
        order: 1,
        label: 'Username',
        placeholder: 'Enter your login username',
        isRequired: true
      },
      email: {
        order: 2,
        label: 'Email',
        placeholder: 'Enter your email',
        isRequired: true
      },
      name: {
        order: 3,
        label: 'Name',
        placeholder: 'Enter your name',
        isRequired: true
      },
      password: {
        order: 5,
        label: 'Password',
        placeholder: 'Enter your password',
        isRequired: true
      }
    }
  };
}

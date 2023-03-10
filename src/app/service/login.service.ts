import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  user: SocialUser | null = null;
  loggedIn: boolean = false;
  private accessToken = '';

  constructor(private authService: SocialAuthService) {

  }

  refreshToken(): void {
    this.authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken = accessToken);
  }

  getGoogleCalendarData(): void {
    if (!this.accessToken) return;

    // this.ajax
    //   .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    //     headers: { Authorization: `Bearer ${this.accessToken}` },
    //   })
    //   .subscribe((events) => {
    //     alert('Look at your console');
    //     console.log('events', events);
    //   });
  }
}

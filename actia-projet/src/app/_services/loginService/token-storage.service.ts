import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    if (token) {
      console.log('Saving token:', token);
      window.sessionStorage.removeItem(TOKEN_KEY);
      window.sessionStorage.setItem(TOKEN_KEY, token);
    } else {
      console.log('No token to save');
    }
  }
  
  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = window.sessionStorage.getItem(TOKEN_KEY);
      return token;
    }
    return null;
  }
  
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
  public removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }
}

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const CONFIRMED_DAYS_KEY = 'confirmedDays';
const SELECTED_DATES_KEY = 'selectedDates';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private readonly SELECTED_DAYS_KEY = 'selectedDays';
  private readonly CONFIRMED_DAYS_KEY = 'confirmedDays';
  signOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.clear();
    }
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  public saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        console.log('Saving token:', token);
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.setItem(TOKEN_KEY, token);
      } else {
        console.log('No token to save');
      }
    }
  }
  
  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = window.localStorage.getItem(TOKEN_KEY);
      return token;
    }
    return null;
  }
  
  public saveUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = window.localStorage.getItem(USER_KEY);
      if (user) {
        return JSON.parse(user);
      }
    }
    return {};
  }

  public removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }

  public isLoggedIn(): boolean {
    console.log("Token:", this.getToken());
    return !!this.getToken();
  }

  // Methods for handling confirmed days
  public saveConfirmedDays(days: Set<string>): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(CONFIRMED_DAYS_KEY, JSON.stringify(Array.from(days)));
    }
  }

  public loadConfirmedDays(): Set<string> {
    if (isPlatformBrowser(this.platformId)) {
      const savedDays = window.localStorage.getItem(CONFIRMED_DAYS_KEY);
      if (savedDays) {
        return new Set(JSON.parse(savedDays));
      }
    }
    return new Set();
  }

  // Methods for handling selected dates
  public saveSelectedDates(days: Set<string>): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(SELECTED_DATES_KEY, JSON.stringify(Array.from(days)));
    }
  }

  public loadSelectedDates(): Set<string> {
    if (isPlatformBrowser(this.platformId)) {
      const savedDates = window.localStorage.getItem(SELECTED_DATES_KEY);
      if (savedDates) {
        return new Set(JSON.parse(savedDates));
      }
    }
    return new Set();
  }

  public saveData(key: string, data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  }
  
  public getData(key: string): any {
    if (isPlatformBrowser(this.platformId)) {
      const data = window.localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    }
    return null;
  }

  getSelectedDates(): string[] {
    const stored = localStorage.getItem(this.SELECTED_DAYS_KEY);
    return stored ? JSON.parse(stored) : [];
  }


  getConfirmedDays(): string[] {
    const stored = localStorage.getItem(this.CONFIRMED_DAYS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const EMPLOYEE_KEY = 'auth-employee';
const CONFIRMED_DAYS_KEY = 'confirmedDays';
const SELECTED_DATES_KEY = 'selectedDates';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  signOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.clear();
    }
  }

  signIn(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  public saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      if (token) {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
    }
  }

  public getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  public saveUser(user: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  }

  public getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = window.localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : {};
    }
    return {};
  }

  public getEmployeeId(): number | null {
    const user = this.getUser();
    return user && user.employee_id ? user.employee_id : null;
  }

  public removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.removeItem(TOKEN_KEY);
    }
  }

  public isLoggedIn(): boolean {
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
      return savedDays ? new Set(JSON.parse(savedDays)) : new Set();
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
      return savedDates ? new Set(JSON.parse(savedDates)) : new Set();
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

  public getSelectedDates(): string[] {
    return this.loadSelectedDates() ? Array.from(this.loadSelectedDates()) : [];
  }

  public getConfirmedDays(): string[] {
    return this.loadConfirmedDays() ? Array.from(this.loadConfirmedDays()) : [];
  }
}

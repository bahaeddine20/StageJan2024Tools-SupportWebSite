import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void{
    localStorage.removeItem(key);
  }
  constructor() {}

  saveConfirmedDays(days: Set<string>): void {
    localStorage.setItem('confirmedDays', JSON.stringify(Array.from(days)));
  }

  loadConfirmedDays(): Set<string> {
    const savedDays = localStorage.getItem('confirmedDays');
    if (savedDays) {
      return new Set(JSON.parse(savedDays));
    }
    return new Set();
  }
  
  saveSelectedDates(days: Set<string>): void {
    localStorage.setItem('selectedDates', JSON.stringify(Array.from(days)));
  }

  loadSelectedDates(): Set<string> {
    const savedDates = localStorage.getItem('selectedDates');
    if (savedDates) {
      return new Set(JSON.parse(savedDates));
    }
    return new Set();
  }
}

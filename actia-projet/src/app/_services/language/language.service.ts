import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject: BehaviorSubject<string>;

  constructor() {
    const savedLanguage = localStorage.getItem('language') || 'en';
    this.languageSubject = new BehaviorSubject<string>(savedLanguage);
  }

  get currentLanguage() {
    return this.languageSubject.asObservable();
  }

  changeLanguage(language: string) {
    localStorage.setItem('language', language);
    this.languageSubject.next(language);
  }
}

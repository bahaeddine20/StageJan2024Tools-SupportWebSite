import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateService } from '@ngx-translate/core';
import { TranslationModule } from '../../translation/translation.module'; // Import the TranslationModule
import { LanguageService } from '../../_services/language/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    
// TODO: `HttpClientModule` should not be imported into a component directly.
// Please refactor the code to add `provideHttpClient()` call to the provider list in the
// application bootstrap logic and remove the `HttpClientModule` import from this component.
HttpClientModule,
    MatDividerModule,
    TranslationModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  languages = [
    { name: 'English', value: 'en', flag: 'assets/images/en.png' },
    { name: 'Français', value: 'fr', flag: 'assets/images/fr.jpg' },
    { name: 'عربي', value: 'ar', flag: 'assets/images/Tn.jpg' }
  ];
  selectedLanguage!: string;
  selectedFlag!: string;

  constructor(private translate: TranslateService, private languageService: LanguageService) {
    const initialLanguage = localStorage.getItem('language') || 'en';
    this.setLanguage(initialLanguage);

    this.languageService.currentLanguage.subscribe(language => {
      this.setLanguage(language);
    });
  }

  switchLanguage(value: string) {
    this.languageService.changeLanguage(value);
  }

  private setLanguage(language: string) {
    this.translate.use(language);
    const selectedLanguage = this.languages.find(lang => lang.value === language);
    if (selectedLanguage) {
      this.selectedLanguage = selectedLanguage.name;
      this.selectedFlag = selectedLanguage.flag;
    }
  }
}

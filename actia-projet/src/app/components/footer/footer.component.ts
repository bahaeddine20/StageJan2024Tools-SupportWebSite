import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatDivider,
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  languages = [
    { name: 'Français', value: 'fr', flag: 'assets/images/fr.jpg' },
    { name: 'English', value: 'en', flag: 'assets/images/en.png' },
    { name: 'عربي', value: 'ar', flag: 'assets/images/Tn.jpg' }
  ];
  selectedLanguage = 'Français';
  selectedFlag = 'assets/images/fr.jpg';
  switchLanguage(value: string) {
    const selectedLanguage = this.languages.find(language => language.value === value);
    if (selectedLanguage) {
      this.selectedLanguage = selectedLanguage.name;
      this.selectedFlag = selectedLanguage.flag;
      // Add your translation switch logic here
    }
  }
}
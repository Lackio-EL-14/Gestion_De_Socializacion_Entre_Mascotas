import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLanguage, LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  readonly languageOptions: readonly AppLanguage[];
  selectedLanguage: AppLanguage;

  constructor(
    private readonly router: Router,
    private readonly languageService: LanguageService,
  ) {
    this.languageOptions = this.languageService.availableLanguages;
    this.selectedLanguage = this.languageService.getCurrentLanguage();
  }

  irARegistroDueno(): void {
    this.router.navigate(['/register']);
  }

  irARegistroTrabajador(): void {
    this.router.navigate(['/register-trabajador']);
  }

  onLanguageChange(language: string): void {
    if (language !== 'es' && language !== 'en' && language !== 'fr') {
      return;
    }

    this.selectedLanguage = language;
    this.languageService.setLanguage(language);
  }
}

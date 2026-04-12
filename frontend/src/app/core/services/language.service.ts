import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'es' | 'en' | 'fr';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly storageKey = 'app_language';
  readonly availableLanguages: AppLanguage[] = ['es', 'en', 'fr'];

  constructor(private readonly translate: TranslateService) {
    this.translate.addLangs(this.availableLanguages);
    this.translate.setDefaultLang('es');

    const savedLanguage = this.getStoredLanguage();
    this.setLanguage(savedLanguage ?? 'es');
  }

  setLanguage(language: AppLanguage): void {
    this.translate.use(language);
    localStorage.setItem(this.storageKey, language);
  }

  getCurrentLanguage(): AppLanguage {
    const current = this.translate.currentLang as AppLanguage | undefined;
    if (current && this.availableLanguages.includes(current)) {
      return current;
    }

    return 'es';
  }

  private getStoredLanguage(): AppLanguage | null {
    const stored = localStorage.getItem(this.storageKey);

    if (stored === 'es' || stored === 'en' || stored === 'fr') {
      return stored;
    }

    return null;
  }
}

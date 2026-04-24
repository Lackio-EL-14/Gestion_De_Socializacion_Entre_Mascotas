import { APP_INITIALIZER, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
  TranslationObject,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LanguageService } from './core/services/language.service';
import { Home } from './features/home/home';
import { DashboardOwner } from './features/dashboards/dashboard-owner/dashboard-owner';
import { DashboardAdmin } from './features/dashboards/dashboard-admin/dashboard-admin';
import { DashboardEditOwner } from './features/dashboards/dashboard-edit_owner/dashboard-edit-owner';
import { SharedModule } from './shared/shared-module';

class AppTranslateLoader implements TranslateLoader {
  constructor(private readonly http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get<TranslationObject>(`assets/i18n/${lang}.json`);
  }
}

export function appTranslateLoaderFactory(http: HttpClient): TranslateLoader {
  return new AppTranslateLoader(http);
}

export function initializeLanguage(languageService: LanguageService): () => void {
  return () => {
    languageService.getCurrentLanguage();
  };
}

@NgModule({
  declarations: [App, Home, DashboardOwner, DashboardEditOwner, DashboardAdmin],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es',
      loader: {
        provide: TranslateLoader,
        useFactory: appTranslateLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeLanguage,
      deps: [LanguageService],
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}

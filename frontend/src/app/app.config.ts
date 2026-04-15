import { ApplicationConfig, importProvidersFrom, Injectable } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

// ============================================================
// 1. CREAMOS EL LOADER COMO UN SERVICIO INYECTABLE
// Esto evita el error NG0203 porque Angular maneja la inyección de forma nativa.
// ============================================================
@Injectable({ providedIn: 'root' })
export class AppTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`./assets/i18n/${lang}.json`);
  }
}

// ============================================================
// 2. CONFIGURACIÓN PRINCIPAL DE LA APP
// ============================================================
export const appConfig: ApplicationConfig = {
  providers: [
    // Proveedor de rutas
    provideRouter(routes),

    // Proveedor HTTP
    provideHttpClient(withFetch()),

    // Módulo de traducción integrado usando useClass
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useClass: AppTranslateLoader // <-- ¡La clave está aquí! Sin factories ni deps.
        }
      })
    )
  ]
};

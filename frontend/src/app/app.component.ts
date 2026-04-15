import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  // Al ponerlo en el constructor, se ejecuta el LanguageService
  // justo cuando la app arranca, cargando tu idioma por defecto.
  constructor(private languageService: LanguageService) {}
}

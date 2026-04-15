import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HomeHeaderComponent } from '../../shared/components/home-header/home-header.component';
import { RoleCardComponent } from '../../shared/components/role-card/role-card.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  // Aquí es donde Angular verifica qué componentes puedes usar en el HTML de arriba
  imports: [RouterModule, HomeHeaderComponent, RoleCardComponent, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {}

  irARegistroDueno(): void {
    this.router.navigate(['/register']);
  }

  irARegistroTrabajador(): void {
    this.router.navigate(['/register-trabajador']);
  }
}

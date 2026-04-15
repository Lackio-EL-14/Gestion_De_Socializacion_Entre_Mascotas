import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-edit-owner',
  standalone: true,
  imports: [FormsModule, TranslateModule], // Si usas ngModel en el form de editar perfil
  templateUrl: './dashboard-edit-owner.component.html',
  styleUrls: ['./dashboard-edit-owner.component.scss']
})
export class DashboardEditOwnerComponent {
  nombreUsuario = sessionStorage.getItem('usuarioNombre') || 'Usuario';
  emailUsuario = sessionStorage.getItem('usuarioEmail') || 'correo@no-disponible.com';
}

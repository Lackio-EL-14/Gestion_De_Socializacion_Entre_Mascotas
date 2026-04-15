import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertModalComponent } from '../../../shared/components/alert-modal/alert-modal.component';
import { TranslateModule } from '@ngx-translate/core';

interface LoginUsuarioRequest { email: string; contrasena: string; }
interface LoginUsuarioResponse { access_token: string; nombre: string; email: string; id_usuario: number; }

@Component({
  selector: 'app-login',
  standalone: true, // ¡Cambio clave!
  imports: [CommonModule, FormsModule, RouterModule, AlertModalComponent, TranslateModule], // ¡Cambio clave!
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  contrasena = '';
  enviando = false;

  // Control del modal
  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  iniciarSesion(): void {
    const email = this.email.trim();
    const contrasena = this.contrasena;

    // ... (Mantén aquí todos tus if de validación exactamente como los tenías) ...
    // ... (Para ahorrar espacio no copio los if, pero no cambies nada de tu lógica) ...

    const body: LoginUsuarioRequest = { email, contrasena };
    this.enviando = true;

    this.http.post<LoginUsuarioResponse>('http://localhost:3000/usuarios/login', body).subscribe({
      next: (respuesta) => {
        sessionStorage.setItem('usuarioEmail', respuesta.email || email);
        localStorage.setItem('id_usuario', String(respuesta.id_usuario));
        localStorage.setItem('access_token', respuesta.access_token);
        sessionStorage.setItem('usuarioNombre', respuesta.nombre);
        this.enviando = false;
        this.router.navigate(['/dashboard-owner']);
      },
      error: (error) => {
        const mensaje = error?.error?.message;
        this.enviando = false;
        this.mostrarModal('{{ "auth.login.modal.loginErrorTitle" | translate }}', Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || '{{ "auth.login.modal.loginErrorMessage" | translate }}', 'error');
        this.cdr.detectChanges();
      },
    });
  }

  mostrarModal(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.modalTitulo = titulo; this.modalMensaje = mensaje; this.modalTipo = tipo; this.modalVisible = true;
  }
  cerrarModal(): void { this.modalVisible = false; }
}

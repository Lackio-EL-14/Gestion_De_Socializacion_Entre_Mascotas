import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertModalComponent } from '../../../../shared/components/alert-modal/alert-modal.component';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-reset-password',
  standalone: true, // ¡Cambio clave!
  imports: [CommonModule, FormsModule, RouterModule, AlertModalComponent, TranslateModule],
  templateUrl: './changePassword.component.html',
  styleUrls: ['./changePassword.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  password = '';
  confirmPassword = '';
  enviando = false;

  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  token: string | null = null;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');

      console.log('TOKEN RECIBIDO:', this.token);

      if (!this.token) {
        this.mostrarModal('Error', "{{ 'auth.passwordRecover.change.modal.missingToken' | translate }}", 'error');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }

  onSubmit(): void {
    if (!this.token) {
      this.mostrarModal('Error', "{{ 'auth.passwordRecover.change.modal.missingToken' | translate }}", 'error');
      return;
    }

    const password = this.password;
    const confirmPassword = this.confirmPassword;

    if (!password || !confirmPassword) {
      this.mostrarModal('Error', "{{ 'auth.passwordRecover.change.modal.allFieldsRequired' | translate }}", 'error');
      return;
    }

    if (password.length < 6) {
      this.mostrarModal('Error', "{{ 'auth.passwordRecover.change.modal.passwordTooShort' | translate }}", 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.mostrarModal('Error', "{{ 'auth.passwordRecover.change.modal.passwordsDoNotMatch' | translate }}", 'error');
      return;
    }

    this.enviando = true;

    this.http.post('http://localhost:3000/usuarios/restablecer-password', {
      token: this.token,
      nueva_contrasena: password
    }).subscribe({
      next: (res: any) => {
        console.log('RESPUESTA RESET:', res);

        this.enviando = false;

        this.mostrarModal(
          'Contraseña actualizada',
          "{{ 'auth.passwordRecover.change.modal.successMessage' | translate }}",
          'success'
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        this.enviando = false;
        const mensaje = error?.error?.message;

        this.mostrarModal(
          'Error',
          Array.isArray(mensaje)
            ? mensaje.join('\n')
            : mensaje || "{{ 'auth.passwordRecover.change.modal.updateError' | translate }}",
          'error'
        );

        this.cdr.detectChanges();
      },
    });
  }

  mostrarModal(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = tipo;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }
}

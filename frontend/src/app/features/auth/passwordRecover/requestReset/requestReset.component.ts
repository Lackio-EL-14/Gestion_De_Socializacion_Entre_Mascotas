import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModalComponent } from '../../../../shared/components/alert-modal/alert-modal.component';
interface RequestResetRequest {
  email: string;
}

@Component({
  selector: 'app-request-reset',
  standalone: true, // ¡Cambio clave!
  imports: [CommonModule, FormsModule, RouterModule, AlertModalComponent, TranslateModule],
  templateUrl: './requestReset.component.html',
  styleUrls: ['./requestReset.component.scss'],
})
export class RequestResetComponent {
  email = '';
  enviando = false;

  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onSubmit(): void {
    console.log('CLICK DETECTADO');
    const email = this.email.trim();

    if (!email) {
      this.mostrarModal('Error', "{{ 'auth.passwordRecover.request.validation.emailRequired' | translate }}", 'error');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModal('Error', "{{ 'auth.passwordRecover.request.validation.emailInvalid' | translate }}" , 'error');
      return;
    }

    const body: RequestResetRequest = { email };

    this.enviando = true;

    this.http.post('http://localhost:3000/usuarios/recuperar-password', body).subscribe({
      next: (res: any) => {
    console.log('RESPUESTA BACKEND:', res);

    const token = res?.dev_token;

    if (!token) {
      this.mostrarModal(
        'Error',
        "{{ 'auth.passwordRecover.request.validation.noToken' | translate }}",
        'error'
      );
      return;
    }

    console.log('TOKEN:', token);

    this.enviando = false;

    this.mostrarModal(
      'Correo enviado',
      "{{ 'auth.passwordRecover.request.modal.successMessage' | translate }}",
      'success'
    );

    setTimeout(() => {
      this.router.navigate(['/reset-password'], {
        queryParams: { token }
      });
    }, 1500);
  },
      error: (error) => {
        this.enviando = false;
        const mensaje = error?.error?.message;

        this.mostrarModal(
          'Error',
          Array.isArray(mensaje)
            ? mensaje.join('\n')
            : mensaje || "{{ 'auth.passwordRecover.request.modal.sendEmailError' | translate }}",
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

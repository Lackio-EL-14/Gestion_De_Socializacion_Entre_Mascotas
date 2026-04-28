import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface RequestResetRequest {
  email: string;
}

@Component({
  selector: 'app-request-reset',
  standalone: false,
  templateUrl: './requestReset.html',
  styleUrls: ['./requestReset.scss'],
})
export class RequestResetComponent {
  email = '';
  enviando = false;

  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly translate: TranslateService,
  ) {}

  onSubmit(): void {
    const email = this.email.trim();

    if (!email) {
      this.mostrarModalByKey(
        'auth.passwordRecover.common.errorTitle',
        'auth.passwordRecover.request.validation.emailRequired',
        'error',
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModalByKey(
        'auth.passwordRecover.common.errorTitle',
        'auth.common.validation.invalidEmail',
        'error',
      );
      return;
    }

    const body: RequestResetRequest = { email };

    this.enviando = true;

    this.http.post('https://gestion-de-socializacion-entre-mascotas.onrender.com/usuarios/recuperar-password', body).subscribe({
      next: (res: any) => {
        const token = res?.dev_token;

        if (!token) {
          this.enviando = false;
          this.mostrarModalByKey(
            'auth.passwordRecover.common.errorTitle',
            'auth.passwordRecover.request.modal.missingToken',
            'error',
          );
          this.cdr.detectChanges();
          return;
        }

        this.enviando = false;

        this.mostrarModalByKey(
          'auth.passwordRecover.request.modal.successTitle',
          'auth.passwordRecover.request.modal.successMessage',
          'success',
        );

        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { token },
          });
        }, 1500);
      },
      error: (error) => {
        this.enviando = false;
        const mensaje = error?.error?.message;

        this.mostrarModal(
          this.t('auth.passwordRecover.common.errorTitle'),
          Array.isArray(mensaje)
            ? mensaje.join('\n')
            : mensaje || this.t('auth.passwordRecover.request.modal.sendEmailError'),
          'error',
        );

        this.cdr.detectChanges();
      },
    });
  }

  t(key: string): string {
    return this.translate.instant(key);
  }

  private mostrarModalByKey(
    titleKey: string,
    messageKey: string,
    tipo: 'success' | 'error',
  ): void {
    this.mostrarModal(this.t(titleKey), this.t(messageKey), tipo);
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

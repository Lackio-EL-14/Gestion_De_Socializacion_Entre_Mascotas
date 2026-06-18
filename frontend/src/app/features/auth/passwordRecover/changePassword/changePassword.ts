import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './changePassword.html',
  styleUrls: ['./changePassword.scss'],
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
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token');

      if (!this.token) {
        this.mostrarModalByKey(
          'auth.passwordRecover.common.errorTitle',
          'auth.passwordRecover.change.modal.invalidToken',
          'error',
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }

  onSubmit(): void {
    if (!this.token) {
      this.mostrarModalByKey(
        'auth.passwordRecover.common.errorTitle',
        'auth.passwordRecover.change.modal.missingToken',
        'error',
      );
      return;
    }

    const password = this.password;
    const confirmPassword = this.confirmPassword;

    if (!password || !confirmPassword) {
      this.mostrarModalByKey(
        'auth.passwordRecover.common.errorTitle',
        'auth.passwordRecover.change.validation.allFieldsRequired',
        'error',
      );
      return;
    }

    if (password.length < 6) {
      this.mostrarModalByKey(
        'auth.passwordRecover.common.errorTitle',
        'auth.common.validation.passwordMinLength',
        'error',
      );
      return;
    }

    if (password !== confirmPassword) {
      this.mostrarModalByKey(
        'auth.passwordRecover.common.errorTitle',
        'auth.common.validation.passwordsDoNotMatch',
        'error',
      );
      return;
    }

    this.enviando = true;

    this.http
      .post('https://gestion-de-socializacion-entre-mascotas.onrender.com/usuarios/restablecer-password', {
        token: this.token,
        nueva_contrasena: password,
      })
      .subscribe({
        next: () => {
          this.enviando = false;

          this.mostrarModalByKey(
            'auth.passwordRecover.change.modal.successTitle',
            'auth.passwordRecover.change.modal.successMessage',
            'success',
          );

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },

        error: (error) => {
          this.enviando = false;
          const mensaje = error?.error?.message;

          this.mostrarModal(
            this.t('auth.passwordRecover.common.errorTitle'),
            Array.isArray(mensaje)
              ? mensaje.join('\n')
              : mensaje || this.t('auth.passwordRecover.change.modal.updateError'),
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

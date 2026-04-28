import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface LoginUsuarioRequest {
  email: string;
  contrasena: string;
}

interface RolResponse {
  id_rol: number;
  nombre_rol: string;
}

interface LoginUsuarioResponse {
  access_token: string;
  nombre: string;
  email: string;
  id_usuario: number;
  rol: RolResponse; // <- NUEVO CAMPO
}

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  contrasena = '';
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

  iniciarSesion(): void {
    const email = this.email.trim();
    const contrasena = this.contrasena;

    if (!email) {
      this.mostrarModalByKey(
        'auth.common.validationErrorTitle',
        'auth.login.validation.emailRequired',
        'error',
      );
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModalByKey(
        'auth.common.validationErrorTitle',
        'auth.common.validation.invalidEmail',
        'error',
      );
      return;
    }

    if (!contrasena) {
      this.mostrarModalByKey(
        'auth.common.validationErrorTitle',
        'auth.common.validation.passwordRequired',
        'error',
      );
      return;
    }

    if (contrasena.length < 6) {
      this.mostrarModalByKey(
        'auth.common.validationErrorTitle',
        'auth.common.validation.passwordMinLength',
        'error',
      );
      return;
    }

    const body: LoginUsuarioRequest = {
      email,
      contrasena,
    };

    this.enviando = true;

    this.http.post<LoginUsuarioResponse>('https://gestion-de-socializacion-entre-mascotas.onrender.com/usuarios/login', body).subscribe({
      next: (respuesta) => {
        console.log('Login exitoso:', respuesta);

        sessionStorage.setItem('usuarioEmail', respuesta.email || email);
        localStorage.setItem('id_usuario', String(respuesta.id_usuario));
        localStorage.setItem('access_token', respuesta.access_token);
        sessionStorage.setItem('usuarioNombre', respuesta.nombre);
        localStorage.setItem('id_rol', String(respuesta.rol?.id_rol || 1));

        this.enviando = false;

        const idRol = respuesta.rol?.id_rol;

        if (idRol === 2) {
          this.router.navigate(['/dashboard-admin']);
        }
        else if(idRol === 3) {
          this.router.navigate(['/dashboard-worker']);
        }
        else {
          this.router.navigate(['/dashboard-owner']);
        }
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        const mensaje = error?.error?.message;

        this.enviando = false;
        this.mostrarModal(
          this.t('auth.login.modal.loginErrorTitle'),
          Array.isArray(mensaje)
            ? mensaje.join('\n')
            : mensaje || this.t('auth.login.modal.loginErrorMessage'),
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

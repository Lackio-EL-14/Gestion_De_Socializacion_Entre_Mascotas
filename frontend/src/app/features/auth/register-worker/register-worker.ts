import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface RegistroTrabajadorRequest {
  nombre: string;
  email: string;
  contrasena_hash: string;
  telefono: string;
  nombre_servicio: string;
  descripcion: string;
}

@Component({
  selector: 'app-register-worker',
  standalone: false,
  templateUrl: './register-worker.html',
  styleUrl: './register-worker.scss'
})
export class RegisterWorkerComponent {
  nombre = '';
  email = '';
  telefono = '';
  contrasena = '';
  confirmarContrasena = '';
  businessName = '';
  businessDescription = '';

  enviando = false;

  // Variables del Modal
  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService,
  ) {}

  registro(): void {
    const nombre = this.nombre.trim();
    const email = this.email.trim();
    const telefono = this.telefono.trim();
    const contrasena = this.contrasena;
    const businessName = this.businessName.trim();
    const businessDescription = this.businessDescription.trim();

    // --- Validaciones (Igual que en tu registro normal) ---
    if (!nombre) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.register.validation.nameRequired', 'error');
      return;
    }

    if (!email) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.register.validation.emailRequired', 'error');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.common.validation.invalidEmail', 'error');
      return;
    }

    if (!contrasena) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.common.validation.passwordRequired', 'error');
      return;
    }

    if (contrasena.length < 6) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.common.validation.passwordMinLength', 'error');
      return;
    }

    if (!this.confirmarContrasena) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.register.validation.confirmPasswordRequired', 'error');
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.common.validation.passwordsDoNotMatch', 'error');
      return;
    }

    if (!telefono) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.register.validation.phoneRequired', 'error');
      return;
    }

    if (telefono.length > 15) {
      this.mostrarModalByKey('auth.common.validationErrorTitle', 'auth.register.validation.phoneTooLong', 'error');
      return;
    }

    // --- Validaciones Específicas del Negocio ---
    if (!businessName) {
      this.mostrarModal(this.t('auth.common.validationErrorTitle'), 'El nombre del negocio es obligatorio', 'error');
      return;
    }

    if (!businessDescription) {
      this.mostrarModal(this.t('auth.common.validationErrorTitle'), 'La descripción del negocio es obligatoria', 'error');
      return;
    }

    // --- Construcción del Payload ---
    const body: RegistroTrabajadorRequest = {
      nombre,
      email,
      contrasena_hash: contrasena,
      telefono,
      nombre_servicio: businessName,
      descripcion: businessDescription
    };

    this.enviando = true;

    // --- Petición HTTP ---
    this.http.post('http://localhost:3000/usuarios/registro-trabajador', body).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.enviando = false;
        this.mostrarModalByKey(
          'auth.register.modal.successTitle',
          'auth.register.modal.successMessage',
          'success'
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al registrar trabajador:', error);
        const mensaje = error?.error?.message;

        this.enviando = false;
        this.mostrarModal(
          this.t('auth.register.modal.errorTitle'),
          Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || this.t('auth.register.modal.errorMessage'),
          'error'
        );
        this.cdr.detectChanges();
      },
    });
  }

  private limpiarFormulario(): void {
    this.nombre = '';
    this.email = '';
    this.telefono = '';
    this.contrasena = '';
    this.confirmarContrasena = '';
    this.businessName = '';
    this.businessDescription = '';
  }

  t(key: string): string {
    return this.translate.instant(key);
  }

  private mostrarModalByKey(titleKey: string, messageKey: string, tipo: 'success' | 'error'): void {
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
    if (this.modalTipo === 'success') {
      this.router.navigate(['/login']);
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModalComponent } from '../../../shared/components/alert-modal/alert-modal.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface RegistroUsuarioRequest {
  nombre: string;
  email: string;
  contrasena_hash: string;
  telefono: string;
}

@Component({
  selector: 'app-register',
  standalone: true, // ¡Cambio clave!
    imports: [CommonModule, FormsModule, RouterModule, AlertModalComponent, TranslateModule], // ¡Cambio clave!
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  nombre = '';
  email = '';
  telefono = '';
  contrasena = '';
  confirmarContrasena = '';
  enviando = false;
  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  registro(): void {
    const nombre = this.nombre.trim();
    const email = this.email.trim();
    const telefono = this.telefono.trim();
    const contrasena = this.contrasena;

    if (!nombre) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.nameRequired' | translate }}", 'error');
      return;
    }

    if (!email) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.emailRequired' | translate }}", 'error');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.emailInvalid' | translate }}", 'error');
      return;
    }

    if (!telefono) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.phoneRequired' | translate }}", 'error');
      return;
    }

    if (telefono.length > 15) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.phoneTooLong' | translate }}", 'error');
      return;
    }

    if (contrasena.length < 6) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.passwordTooShort' | translate }}", 'error');
      return;
    }

    if (!contrasena) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.passwordRequired' | translate }}", 'error');
      return;
    }

    if (!this.confirmarContrasena) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.confirmPasswordRequired' | translate }}", 'error');
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.mostrarModal('Error de validación', "{{ 'auth.register.validation.passwordsNotMatch' | translate }}", 'error');
      return;
    }

    const body: RegistroUsuarioRequest = {
      nombre,
      email,
      contrasena_hash: contrasena,
      telefono,
    };

    this.enviando = true;

    this.http.post('http://localhost:3000/usuarios/registro', body).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.enviando = false;
        this.mostrarModal('{{ "auth.register.modal.successTitle" | translate }}', '{{ "auth.register.modal.successMessage" | translate }}', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        const mensaje = error?.error?.message;

        this.enviando = false;
        this.mostrarModal(
          '{{ "auth.register.modal.errorTitle" | translate }}',
          Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || '{{ "auth.register.modal.errorMessage" | translate }}',
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

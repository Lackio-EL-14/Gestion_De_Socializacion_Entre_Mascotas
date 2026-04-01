import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

interface RegistroUsuarioRequest {
  nombre: string;
  email: string;
  contrasena_hash: string;
  telefono: string;
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
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
      this.mostrarModal('Error de validación', 'El nombre es obligatorio', 'error');
      return;
    }

    if (!email) {
      this.mostrarModal('Error de validación', 'El correo electrónico es obligatorio', 'error');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModal('Error de validación', 'El formato del correo no es válido', 'error');
      return;
    }

    if (!telefono) {
      this.mostrarModal('Error de validación', 'El teléfono es obligatorio', 'error');
      return;
    }

    if (telefono.length > 15) {
      this.mostrarModal('Error de validación', 'El teléfono es demasiado largo', 'error');
      return;
    }

    if (contrasena.length < 6) {
      this.mostrarModal('Error de validación', 'La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    if (!contrasena) {
      this.mostrarModal('Error de validación', 'La contraseña es obligatoria', 'error');
      return;
    }

    if (!this.confirmarContrasena) {
      this.mostrarModal('Error de validación', 'Debes confirmar la contraseña', 'error');
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      this.mostrarModal('Error de validación', 'Las contraseñas no coinciden', 'error');
      return;
    }

    const body: RegistroUsuarioRequest = {
      nombre,
      email,
      contrasena_hash: contrasena,
      telefono,
    };

    this.enviando = true;

    this.http.post('https://gestion-de-socializacion-entre-mascotas.onrender.com/usuarios/registro', body).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.enviando = false;
        this.mostrarModal('Registro exitoso', 'Cuenta creada correctamente', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        const mensaje = error?.error?.message;

        this.enviando = false;
        this.mostrarModal(
          'Error de registro',
          Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || 'Hubo un error al registrar',
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

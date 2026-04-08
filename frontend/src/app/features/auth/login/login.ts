import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

interface LoginUsuarioRequest {
  email: string;
  contrasena: string;
}

interface LoginUsuarioResponse {
  access_token: string;
  nombre: string;
  email: string;
  id_usuario: number;
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
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  iniciarSesion(): void {
    const email = this.email.trim();
    const contrasena = this.contrasena;

    if (!email) {
      this.mostrarModal('Error de validación', 'El correo electrónico es obligatorio', 'error');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModal('Error de validación', 'El formato del correo no es válido', 'error');
      return;
    }

    if (!contrasena) {
      this.mostrarModal('Error de validación', 'La contraseña es obligatoria', 'error');
      return;
    }

    if (contrasena.length < 6) {
      this.mostrarModal('Error de validación', 'La contraseña debe tener al menos 6 caracteres', 'error');
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

        this.enviando = false;       
        this.router.navigate(['/dashboard-owner']);
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        const mensaje = error?.error?.message;

        this.enviando = false;
        this.mostrarModal(
          'Error de inicio de sesión',
          Array.isArray(mensaje)
            ? mensaje.join('\n')
            : mensaje || 'Credenciales inválidas o error al iniciar sesión',
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

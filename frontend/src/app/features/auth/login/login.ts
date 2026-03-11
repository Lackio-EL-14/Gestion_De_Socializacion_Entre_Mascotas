import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

interface LoginUsuarioRequest {
  email: string;
  contrasena: string;
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

  constructor(private http: HttpClient) {}

  iniciarSesion(): void {
    if (!this.email || !this.contrasena) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const body: LoginUsuarioRequest = {
      email: this.email.trim(),
      contrasena: this.contrasena,
    };

    this.enviando = true;

    this.http.post('http://localhost:3000/usuarios/login', body).subscribe({
      next: (respuesta) => {
        console.log('Login exitoso:', respuesta);
        alert('Inicio de sesión correcto');
        this.enviando = false;
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error);
        const mensaje = error?.error?.message;
        alert(
          Array.isArray(mensaje)
            ? mensaje.join('\n')
            : mensaje || 'Credenciales inválidas o error al iniciar sesión'
        );
        this.enviando = false;
      },
    });
  }
}
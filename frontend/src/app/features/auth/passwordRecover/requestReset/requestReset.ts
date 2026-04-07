import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

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
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onSubmit(): void {
    console.log('CLICK DETECTADO');
    const email = this.email.trim();

    if (!email) {
      this.mostrarModal('Error', 'El correo es obligatorio', 'error');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValido.test(email)) {
      this.mostrarModal('Error', 'Formato de correo inválido', 'error');
      return;
    }

    const body: RequestResetRequest = { email };

    this.enviando = true;

    this.http.post('https://gestion-de-socializacion-entre-mascotas.onrender.com/usuarios/recuperar-password', body).subscribe({
      next: (res: any) => {
    console.log('RESPUESTA BACKEND:', res);

    const token = res?.dev_token;

    if (!token) {
      this.mostrarModal(
        'Error',
        'No se recibió el token de recuperación',
        'error'
      );
      return;
    }

    console.log('TOKEN:', token);

    this.enviando = false;

    this.mostrarModal(
      'Correo enviado',
      'Redirigiendo para cambiar contraseña...',
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
            : mensaje || 'Error al enviar el correo',
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

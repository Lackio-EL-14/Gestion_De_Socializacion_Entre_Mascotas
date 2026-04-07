import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token');

      console.log('TOKEN RECIBIDO:', this.token);

      if (!this.token) {
        this.mostrarModal('Error', 'Token inválido o expirado', 'error');

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      }
    });
  }

  onSubmit(): void {
    if (!this.token) {
      this.mostrarModal('Error', 'Token de verificación faltante', 'error');
      return;
    }

    const password = this.password;
    const confirmPassword = this.confirmPassword;

    if (!password || !confirmPassword) {
      this.mostrarModal('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    if (password.length < 6) {
      this.mostrarModal('Error', 'Mínimo 6 caracteres', 'error');
      return;
    }

    if (password !== confirmPassword) {
      this.mostrarModal('Error', 'Las contraseñas no coinciden', 'error');
      return;
    }

    this.enviando = true;

    this.http.post('https://gestion-de-socializacion-entre-mascotas.onrender.com/usuarios/restablecer-password', {
      token: this.token,
      nueva_contrasena: password
    }).subscribe({
      next: (res: any) => {
        console.log('RESPUESTA RESET:', res);

        this.enviando = false;

        this.mostrarModal(
          'Contraseña actualizada',
          'Ahora puedes iniciar sesión',
          'success'
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },

      error: (error) => {
        this.enviando = false;
        const mensaje = error?.error?.message;

        this.mostrarModal(
          'Error',
          Array.isArray(mensaje)
            ? mensaje.join('\n')
            : mensaje || 'No se pudo cambiar la contraseña',
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

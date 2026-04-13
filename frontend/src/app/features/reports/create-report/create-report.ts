import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

interface CreateReportRequest {
  motivo: string;
  comentario: string;
  id_usuario_reportado: number;
}

interface CreateReportResponse {
  id: number;
  motivo: string;
  comentario: string;
  estado: string;
  fecha_reporte: string;
  fecha_resolucion: string | null;
  id_usuario_reportante: number;
  id_usuario_reportado: number;
  id_admin_resolutor: number | null;
}

@Component({
  selector: 'app-create-report',
  standalone: false,
  templateUrl: './create-report.html',
  styleUrl: './create-report.scss'
})
export class CreateReportComponent {
  motivo = '';
  comentario = '';
  idUsuarioReported: number | null = null;

  enviando = false;
  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    const rawId = history.state?.id_usuario_reported;
    this.idUsuarioReported =
      Number.isInteger(Number(rawId)) && Number(rawId) > 0 ? Number(rawId) : null;
  }

  submit(): void {
    if (this.enviando) {
      return;
    }

    const motivo = this.motivo.trim();
    const comentario = this.comentario.trim();
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.mostrarModal('Error', 'No se encontró el token de sesión. Inicia sesión nuevamente.', 'error');
      return;
    }

    if (!this.idUsuarioReported) {
      this.mostrarModal('Error', 'No se encontró el usuario a reportar.', 'error');
      return;
    }

    if (!motivo) {
      this.mostrarModal('Error de validación', 'El motivo es obligatorio.', 'error');
      return;
    }

    if (!comentario) {
      this.mostrarModal('Error de validación', 'El comentario es obligatorio.', 'error');
      return;
    }

    const body: CreateReportRequest = {
      motivo,
      comentario,
      id_usuario_reportado: this.idUsuarioReported
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.enviando = true;

    this.http.post<CreateReportResponse>('http://localhost:3000/reports', body, { headers }).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarModal('Éxito', 'El reporte fue enviado correctamente.', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear el reporte:', error);
        const mensaje = error?.error?.message || 'No se pudo enviar el reporte.';
        this.enviando = false;
        this.mostrarModal(
          'Error',
          Array.isArray(mensaje) ? mensaje.join('\n') : mensaje,
          'error'
        );
        this.cdr.detectChanges();
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/feed']);
  }

  cerrarModal(): void {
    this.modalVisible = false;

    if (this.modalTipo === 'success') {
      this.router.navigate(['/feed']);
    }
  }

  mostrarModal(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = tipo;
    this.modalVisible = true;
  }
}
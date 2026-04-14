import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  idUsuarioReportado: number | null = null;

  enviando = false;
  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {
    const rawId = history.state?.id_usuario_reported;
    this.idUsuarioReportado =
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
      this.mostrarModalByKey('reports.common.errorTitle', 'reports.create.errors.noSession', 'error');
      return;
    }

    if (!this.idUsuarioReportado) {
      this.mostrarModalByKey('reports.common.errorTitle', 'reports.create.errors.noReportedUser', 'error');
      return;
    }

    if (!motivo) {
      this.mostrarModalByKey('reports.common.validationTitle', 'reports.create.validation.subjectRequired', 'error');
      return;
    }

    if (!comentario) {
      this.mostrarModalByKey('reports.common.validationTitle', 'reports.create.validation.commentRequired', 'error');
      return;
    }

    const body: CreateReportRequest = {
      motivo,
      comentario,
      id_usuario_reportado: this.idUsuarioReportado
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.enviando = true;

    this.http.post<CreateReportResponse>('http://localhost:3000/reports', body, { headers }).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarModalByKey('reports.create.modal.successTitle', 'reports.create.modal.successMessage', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear el reporte:', error);
        const mensaje = error?.error?.message || this.t('reports.create.modal.errorMessage');
        this.enviando = false;
        this.mostrarModal(
          this.t('reports.common.errorTitle'),
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

  private mostrarModalByKey(titleKey: string, messageKey: string, tipo: 'success' | 'error'): void {
    this.mostrarModal(this.t(titleKey), this.t(messageKey), tipo);
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
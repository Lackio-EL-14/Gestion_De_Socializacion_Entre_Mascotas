import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface RolDto {
  idRol: number;
  nombre: string;
  descripcion: string;
}

interface UsuarioReporteDto {
  idUsuario: number;
  nombre: string;
  email: string;
  estaActivo: boolean;
  cantidadStrikes: number;
  rol: RolDto;
}

interface ReportePendienteDto {
  idReporte: number;
  motivo: string;
  comentario: string;
  estado: string;
  fechaResolucion: string | null;
  adminResolutor: unknown | null;
  usuarioReportado: UsuarioReporteDto;
  usuarioReportante: UsuarioReporteDto;
}

@Component({
  selector: 'app-reports-panel',
  standalone: false,
  templateUrl: './reports-panel.html',
  styleUrl: './reports-panel.scss'
})
export class ReportsPanelComponent implements OnInit {
  reportes: ReportePendienteDto[] = [];
  cargando = false;
  error = '';

  private readonly apiUrl = 'http://localhost:8080/api/admin/reportes/pendientes';

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.obtenerReportesPendientes();
  }

  obtenerReportesPendientes(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.error = this.t('admin.reports.errors.noSession');
      return;
    }

    this.cargando = true;
    this.error = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<ReportePendienteDto[]>(this.apiUrl, { headers }).subscribe({
      next: (respuesta) => {
        this.reportes = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener reportes pendientes:', error);
        this.error = this.t('admin.reports.errors.loadFailed');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  getEstadoTexto(estado: string): string {
    const normalizado = (estado || '').toLowerCase().trim();

    if (normalizado === 'pendiente') {
      return this.t('admin.reports.status.pending');
    }

    if (normalizado === 'aprobado') {
      return this.t('admin.reports.status.approved');
    }

    if (normalizado === 'anulado') {
      return this.t('admin.reports.status.cancelled');
    }

    return estado;
  }

  getEstadoClase(estado: string): string {
    const normalizado = (estado || '').toLowerCase().trim();

    if (normalizado === 'pendiente') {
      return 'pendiente';
    }

    if (normalizado === 'aprobado') {
      return 'aprobado';
    }

    if (normalizado === 'anulado') {
      return 'anulado';
    }

    return 'pendiente';
  }

  verReporte(idReporte: number): void {
    console.log('Ver reporte:', idReporte);
    // siguiente paso: navegar a pantalla detalle
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
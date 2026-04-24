import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface AccionRequest {
  idAdmin: number;
  accion: 'PENALIZAR' | 'BANEO_DIRECTO' | 'IGNORAR';
}

@Component({
  selector: 'app-answer-report',
  standalone: false,
  templateUrl: './answer-report.html',
  styleUrl: './answer-report.scss'
})
export class AnswerReportComponent implements OnInit {

  reporte: any = null;
  cargando = false;
  procesando = false;
  error = '';
  exito = '';

  readonly placeholderImg = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b';

  private readonly apiUrl = 'http://localhost:8080/api/admin/reportes';

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.reporte = history.state?.reporte;

    if (!this.reporte && id) {
      this.cargarReporteDesdePendientes(id);
      return;
    }

    if (!this.reporte) {
      this.error = 'No se encontró el reporte';
    }
  }

  procesar(accion: 'PENALIZAR' | 'BANEO_DIRECTO' | 'IGNORAR'): void {
    const token = localStorage.getItem('access_token');
    const idAdmin = Number(localStorage.getItem('id_usuario'));

    if (!token || !this.reporte) return;

    this.procesando = true;
    this.error = '';
    this.exito = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body: AccionRequest = {
      idAdmin,
      accion
    };

    this.http.post(`${this.apiUrl}/${this.reporte.idReporte}/procesar`, body, { headers })
      .subscribe({
        next: () => {
        this.procesando = false;
        this.router.navigate(['/admin/reports']);
      },
        error: (err) => {
          console.error(err);
          this.error = 'Error al procesar el reporte';
          this.procesando = false;
          this.cdr.detectChanges();
        }
      });
  }

  volver(): void {
    this.router.navigate(['/admin/reports']);
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }

  cargarReporteDesdePendientes(idReporte: number): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.error = 'No hay sesión activa';
      return;
    }

    this.cargando = true;
    this.error = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http
      .get<any[]>('http://localhost:8080/api/admin/reportes/pendientes', { headers })
      .subscribe({
        next: (reportes) => {
          this.reporte = reportes.find(r => r.idReporte === idReporte) || null;

          if (!this.reporte) {
            this.error = 'No se encontró el reporte solicitado';
          }

          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar reporte:', error);
          this.error = 'No se pudo cargar el reporte';
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }
}
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
    const nav = this.router.getCurrentNavigation();
    this.reporte = nav?.extras?.state?.['reporte'];

    // fallback si recarga
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
        next: (res: any) => {
          this.reporte = res;
          this.exito = 'Reporte procesado correctamente';
          this.procesando = false;
          this.cdr.detectChanges();
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
}
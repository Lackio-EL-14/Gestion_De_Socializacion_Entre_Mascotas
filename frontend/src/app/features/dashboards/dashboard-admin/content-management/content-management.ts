import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

interface AdminPublicationItem {
  id_publicacion: number;
  contenido_texto: string;
  imagen_url: string | null;
  fecha_publicacion: string;
  estado: string;
  id_usuario: number;
}

@Component({
  selector: 'app-admin-content-publications',
  standalone: false,
  templateUrl: './content-management.html',
  styleUrl: './content-management.scss',
})
export class AdminContentPublicationsComponent implements OnInit {
  private readonly apiBaseUrl = 'http://localhost:3000';

  publicaciones: AdminPublicationItem[] = [];
  cargando = false;
  error = '';
  emptyMessage = '';
  feedback = '';
  feedbackType: 'success' | 'error' = 'success';
  processingId: number | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    void this.cargarPublicaciones();
  }

  get pendientesCount(): number {
    return this.publicaciones.filter((publicacion) => this.normalizarEstado(publicacion.estado) === 'pendiente').length;
  }

  get hasPublicaciones(): boolean {
    return this.publicaciones.length > 0;
  }

  cargarPublicaciones(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.error = this.t('admin.content.errors.noSession');
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.error = '';
    this.emptyMessage = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<AdminPublicationItem[]>(`${this.apiBaseUrl}/publications`, { headers }).subscribe({
      next: (response) => {
        this.publicaciones = Array.isArray(response) ? response : [];

        if (this.publicaciones.length === 0) {
          this.emptyMessage = this.t('admin.content.empty');
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar publicaciones para admin:', error);
        this.error = this.t('admin.content.errors.loadFailed');
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  getStatusLabel(estado: string): string {
    const normalizado = this.normalizarEstado(estado);

    if (normalizado === 'pendiente') {
      return this.t('admin.content.status.pending');
    }

    if (normalizado === 'aprobada') {
      return this.t('admin.content.status.approved');
    }

    if (normalizado === 'rechazada') {
      return this.t('admin.content.status.rejected');
    }

    return estado;
  }

  getStatusClass(estado: string): string {
    return this.normalizarEstado(estado);
  }

  getImageUrl(publicacion: AdminPublicationItem): string {
    return publicacion.imagen_url || '';
  }

  isPending(publicacion: AdminPublicationItem): boolean {
    return this.normalizarEstado(publicacion.estado) === 'pendiente';
  }

  async aprobar(publicacion: AdminPublicationItem): Promise<void> {
    await this.moderar(publicacion, 'aprobada');
  }

  async rechazar(publicacion: AdminPublicationItem): Promise<void> {
    await this.moderar(publicacion, 'rechazada');
  }

  private async moderar(publicacion: AdminPublicationItem, estado: 'aprobada' | 'rechazada'): Promise<void> {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.error = this.t('admin.content.errors.noSession');
      return;
    }

    this.processingId = publicacion.id_publicacion;
    this.feedback = '';
    this.error = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    try {
      await firstValueFrom(
        this.http.patch(
          `${this.apiBaseUrl}/publications/${publicacion.id_publicacion}/moderate`,
          { estado },
          { headers },
        ),
      );

      this.feedbackType = 'success';
      this.feedback = estado === 'aprobada'
        ? this.t('admin.content.messages.approved')
        : this.t('admin.content.messages.rejected');

      this.cargarPublicaciones();
    } catch (error) {
      console.error('Error al moderar publicación:', error);
      this.feedbackType = 'error';
      this.feedback = this.t('admin.content.messages.moderationFailed');
    } finally {
      this.processingId = null;
    }
  }

  private normalizarEstado(estado: string): string {
    return (estado || '').trim().toLowerCase();
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
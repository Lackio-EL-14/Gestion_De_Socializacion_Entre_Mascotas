import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface UsuarioPerfil {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  foto_perfil_url: string | null;
  fecha_registro: string;
}

interface MascotaUsuario {
  id_mascota: number;
  nombre: string;
  raza: string;
  tamano: string;
  edad: number;
  genero: string;
  estado_salud: string;
  vacuna_imagen_url: string | null;
  fecha_registro: string;
}

@Component({
  selector: 'app-public-profile-user',
  standalone: false,
  templateUrl: './public-profile-user.html',
  styleUrl: './public-profile-user.scss'
})
export class PublicProfileUserComponent implements OnInit {
  usuario: UsuarioPerfil | null = null;
  mascotas: MascotaUsuario[] = [];

  cargando = false;
  cargandoMascotas = false;
  error = '';
  errorMascotas = '';

  readonly fotoPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80';

  readonly mascotaPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';

  constructor(
    private readonly http: HttpClient,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = this.t('users.publicProfile.errors.invalidId');
      return;
    }

    const idUsuario = Number(id);
    this.obtenerUsuario(idUsuario);
    this.obtenerMascotasUsuario(idUsuario);
  }

  obtenerUsuario(id: number): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.error = this.t('users.publicProfile.errors.noSession');
      return;
    }

    this.cargando = true;
    this.error = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<UsuarioPerfil>(`http://localhost:3000/usuarios/${id}`, { headers }).subscribe({
      next: (respuesta) => {
        this.usuario = respuesta;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar perfil:', error);
        this.error = this.t('users.publicProfile.errors.loadFailed');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obtenerMascotasUsuario(idUsuario: number): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.errorMascotas = this.t('users.publicProfile.pets.errors.noSession');
      return;
    }

    this.cargandoMascotas = true;
    this.errorMascotas = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<MascotaUsuario[]>(`http://localhost:3000/pets/user/${idUsuario}`, { headers }).subscribe({
      next: (respuesta) => {
        this.mascotas = Array.isArray(respuesta) ? respuesta : [];
        this.cargandoMascotas = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar mascotas del usuario:', error);
        this.errorMascotas = this.t('users.publicProfile.pets.errors.loadFailed');
        this.cargandoMascotas = false;
        this.cdr.detectChanges();
      }
    });
  }

  getFoto(): string {
    return this.usuario?.foto_perfil_url || this.fotoPlaceholder;
  }

  getMascotaPlaceholder(): string {
    return this.mascotaPlaceholder;
  }

  getHealthBadgeClass(estadoSalud: string): string {
    const health = estadoSalud?.toLowerCase().trim() ?? '';
    return health.replace(/\s+/g, '-');
  }

  onVaccineCardClick(event: MouseEvent, vacunaUrl: string | null): void {
    if (!vacunaUrl) {
      event.preventDefault();
    }
  }

  volver(): void {
    this.router.navigate(['/users']);
  }

  reportarUsuario(): void {
    if (!this.usuario?.id_usuario) {
      return;
    }

    this.router.navigate(['/reports/create-report'], {
      state: { id_usuario_reported: this.usuario.id_usuario }
    });
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
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

@Component({
  selector: 'app-public-profile-user',
  standalone: false,
  templateUrl: './public-profile-user.html',
  styleUrl: './public-profile-user.scss'
})
export class PublicProfileUserComponent implements OnInit {
  usuario: UsuarioPerfil | null = null;
  cargando = false;
  error = '';

  readonly fotoPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80';

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

    this.obtenerUsuario(Number(id));
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

  getFoto(): string {
    return this.usuario?.foto_perfil_url || this.fotoPlaceholder;
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
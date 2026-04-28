import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface RolUsuario {
  id_rol: number;
  nombre_rol: string;
  descripcion: string;
}

interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string;
  foto_perfil_url: string | null;
  cantidad_strikes: number;
  fecha_registro: string;
  esta_activo: boolean;
  rol: RolUsuario;
}

@Component({
  selector: 'app-list-users',
  standalone: false,
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss'
})
export class ListUsersComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = false;
  error = '';
  busqueda = '';

  readonly fotoPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.cargando = true;
    this.error = '';

    this.http.get<Usuario[]>('https://gestion-de-socializacion-entre-mascotas.onrender.com/usuarios').subscribe({
      next: (respuesta) => {
        const idUsuarioLogeado = Number(localStorage.getItem('id_usuario') || 0);

        this.usuarios = respuesta.filter(
          usuario =>
            usuario.rol?.nombre_rol === 'Usuario' &&
            usuario.id_usuario !== idUsuarioLogeado
        );

        this.usuariosFiltrados = [...this.usuarios];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.error = this.t('users.list.errors.loadFailed');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarUsuarios(): void {
    const termino = this.busqueda.trim();

    if (!termino) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    let regex: RegExp;

    try {
      regex = new RegExp(termino, 'i');
    } catch {
      const escapado = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      regex = new RegExp(escapado, 'i');
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      regex.test(usuario.nombre)
    );
  }

  getEstadoTexto(usuario: Usuario): string {
    return usuario.esta_activo
      ? this.t('users.list.status.active')
      : this.t('users.list.status.inactive');
  }

  getEstadoClase(usuario: Usuario): string {
    return usuario.esta_activo ? 'activo' : 'inactivo';
  }

  getFoto(usuario: Usuario): string {
    return usuario.foto_perfil_url || this.fotoPlaceholder;
  }

  verPerfil(idUsuario: number): void {
    this.router.navigate(['/users/profile', idUsuario]);
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface MyProfileResponse {
  id_usuario: number;
  nombre: string;
  email: string;
  telefono: string | null;
  foto_perfil_url?: string | null;
  fecha_registro?: string;
}

interface UpdateMyProfileRequest {
  nombre: string;
  email: string;
  telefono: string;
}

@Component({
	selector: 'app-dashboard-edit-owner',
	standalone: false,
	templateUrl: './dashboard-edit-owner.html',
	styleUrl: './dashboard-edit-owner.scss'
})
export class DashboardEditOwner implements OnInit {
	nombreUsuario = 'Usuario';
	emailUsuario = 'correo@no-disponible.com';
	telefonoUsuario = '';

	nombre = '';
	email = '';
	telefono = '';

	cargandoPerfil = false;
	enviandoPerfil = false;

	perfilMensaje = '';
	perfilTipo: 'success' | 'error' | '' = '';

	constructor(
		private readonly http: HttpClient,
		private readonly cdr: ChangeDetectorRef,
		private readonly translate: TranslateService,
	) {}

	ngOnInit(): void {
		this.cargarPerfil();
	}

	guardarPerfil(): void {
		if (this.enviandoPerfil) {
			return;
		}

		const nombre = this.nombre.trim();
		const email = this.email.trim();
		const telefono = this.telefono.trim();

		if (!nombre) {
			this.setPerfilEstado('error', 'El nombre es obligatorio');
			return;
		}

		if (!email) {
			this.setPerfilEstado('error', 'El correo es obligatorio');
			return;
		}

		const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailValido.test(email)) {
			this.setPerfilEstado('error', 'El formato del correo no es válido');
			return;
		}

		const headers = this.getAuthHeaders();
		if (!headers) {
			this.setPerfilEstado('error', 'No se encontró el token de sesión');
			return;
		}

		const body: UpdateMyProfileRequest = { nombre, email, telefono };

		this.enviandoPerfil = true;
		this.perfilMensaje = '';
		this.perfilTipo = '';

		this.http.patch<MyProfileResponse>('http://localhost:3000/usuarios/me', body, { headers }).subscribe({
			next: (perfil) => {
				this.enviandoPerfil = false;
				this.aplicarPerfil(perfil);
				sessionStorage.setItem('usuarioNombre', this.nombreUsuario);
				sessionStorage.setItem('usuarioEmail', this.emailUsuario);
				this.setPerfilEstado('success', 'Perfil actualizado correctamente');
				this.cdr.detectChanges();
			},
			error: (error) => {
				const mensaje = error?.error?.message;
				this.enviandoPerfil = false;
				this.setPerfilEstado(
					'error',
					Array.isArray(mensaje) ? mensaje.join('\n') : mensaje || 'No se pudo actualizar el perfil',
				);
				this.cdr.detectChanges();
			},
		});
	}

	restaurarPerfil(): void {
		this.nombre = this.nombreUsuario;
		this.email = this.emailUsuario;
		this.telefono = this.telefonoUsuario;
		this.perfilMensaje = '';
		this.perfilTipo = '';
	}

	private cargarPerfil(): void {
		const headers = this.getAuthHeaders();
		if (!headers) {
			this.nombreUsuario = sessionStorage.getItem('usuarioNombre') || 'Usuario';
			this.emailUsuario = sessionStorage.getItem('usuarioEmail') || 'correo@no-disponible.com';
			this.restaurarPerfil();
			return;
		}

		this.cargandoPerfil = true;
		this.http.get<MyProfileResponse>('http://localhost:3000/usuarios/me', { headers }).subscribe({
			next: (perfil) => {
				this.cargandoPerfil = false;
				this.aplicarPerfil(perfil);
				this.cdr.detectChanges();
			},
			error: () => {
				this.cargandoPerfil = false;
				this.nombreUsuario = sessionStorage.getItem('usuarioNombre') || 'Usuario';
				this.emailUsuario = sessionStorage.getItem('usuarioEmail') || 'correo@no-disponible.com';
				this.telefonoUsuario = '';
				this.restaurarPerfil();
				this.setPerfilEstado('error', 'No se pudo cargar el perfil');
				this.cdr.detectChanges();
			},
		});
	}

	private aplicarPerfil(perfil: MyProfileResponse): void {
		this.nombreUsuario = perfil.nombre || 'Usuario';
		this.emailUsuario = perfil.email || 'correo@no-disponible.com';
		this.telefonoUsuario = perfil.telefono || '';

		this.nombre = this.nombreUsuario;
		this.email = this.emailUsuario;
		this.telefono = this.telefonoUsuario;
	}

	private getAuthHeaders(): HttpHeaders | null {
		const token = localStorage.getItem('access_token');
		if (!token) {
			return null;
		}

		return new HttpHeaders().set('Authorization', `Bearer ${token}`);
	}

	private setPerfilEstado(tipo: 'success' | 'error', mensaje: string): void {
		this.perfilTipo = tipo;
		this.perfilMensaje = mensaje;
	}

	private t(key: string): string {
		return this.translate.instant(key);
	}
}

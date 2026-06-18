import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface Mascota {
  id_mascota: number;
  nombre: string;
  raza: string;
  tamano: string;
  edad: number;
  genero: string;
  estado_salud: string;
  perfil_imagen_url: string | null;
  vacuna_imagen_url: string | null;
  fecha_registro: string;
  id_usuario: number;
}

@Component({
  selector: 'app-list-pets',
  standalone: false,
  templateUrl: './list-pets.html',
  styleUrl: './list-pets.scss'
})
export class ListPetsComponent implements OnInit {
  mascotas: Mascota[] = [];
  cargando = false;
  error = '';

  modalEliminarVisible = false;
  mascotaSeleccionada: Mascota | null = null;
  eliminando = false;

  readonly imagenPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.obtenerMascotas();
  }
obtenerMascotas(): void {
    const idUsuario = localStorage.getItem('id_usuario');
    const token = localStorage.getItem('access_token');

    if (!idUsuario || !token) {
      this.error = this.t('pets.list.errors.noSession');
      return;
    }

    this.cargando = true;
    this.error = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Mascota[] | Mascota>(
      `http://localhost:3000/pets/my-pets`,
      { headers }
    ).subscribe({
      next: (respuesta) => {
        this.mascotas = Array.isArray(respuesta) ? respuesta : [respuesta];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener mascotas:', error);
        this.error = this.t('pets.list.errors.loadFailed');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
  editarMascota(idMascota: number): void {
    this.router.navigate(['/pets/edit-pet', idMascota]);
  }

  getNombreSeguro(nombre: string): string {
    return nombre?.trim() ? nombre : 'Sin nombre';
  }

  getRazaSegura(raza: string): string {
    return raza?.trim() ? raza : this.t('pets.list.noBreed');
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }

  abrirModalEliminar(mascota: Mascota): void {
    this.mascotaSeleccionada = mascota;
    this.modalEliminarVisible = true;
  }

  cerrarModalEliminar(): void {
    this.modalEliminarVisible = false;
    this.mascotaSeleccionada = null;
    this.eliminando = false;
  }

  eliminarMascota(): void {

    const token = localStorage.getItem('access_token');

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token}`
    );

    if (!this.mascotaSeleccionada) {
      return;
    }

    this.eliminando = true;

    this.http.delete(
      `http://localhost:3000/pets/${this.mascotaSeleccionada.id_mascota}`,
      { headers }
    ).subscribe({

      next: () => {

        this.mascotas = this.mascotas.filter(
          mascota =>
            mascota.id_mascota !==
            this.mascotaSeleccionada?.id_mascota
        );

        this.eliminando = false;
        this.cerrarModalEliminar();
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);
        this.eliminando = false;
        alert('No se pudo eliminar la mascota');
      }
    });
  }


}

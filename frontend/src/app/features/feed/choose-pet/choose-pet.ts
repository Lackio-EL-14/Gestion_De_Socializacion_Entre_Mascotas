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
  vacuna_imagen_url: string | null;
  perfil_imagen_url: string | null;
  fecha_registro: string;
  id_usuario: number;
}

@Component({
  selector: 'app-choose-pet',
  standalone: false,
  templateUrl: './choose-pet.html',
  styleUrl: './choose-pet.scss'
})
export class ChoosePetComponent implements OnInit {
  mascotas: Mascota[] = [];
  cargando = false;
  error = '';

  readonly imagenPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.obtenerMascotas();
  }

  obtenerMascotas(): void {
    const idUsuario = localStorage.getItem('id_usuario');
    const token = localStorage.getItem('access_token');

    if (!idUsuario || !token) {
      this.error = this.t('feed.choosePet.errors.noSession');
      return;
    }

    this.cargando = true;
    this.error = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<Mascota[] | Mascota>('http://localhost:3000/pets/my-pets', { headers })
      .subscribe({
        next: (respuesta) => {
          this.mascotas = Array.isArray(respuesta) ? respuesta : [respuesta];
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al obtener mascotas:', error);
          this.error = this.t('feed.choosePet.errors.loadFailed');
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
  }

  elegirMascota(idMascota: number): void {
    const mascota = this.mascotas.find(m => m.id_mascota === idMascota);
    localStorage.setItem('id_mascota_actual', String(idMascota));

    this.router.navigate(['/feed/home', idMascota], {
    state: { nombreMascota: mascota?.nombre || '' }
    });
  }

  crearMascota(): void {
    this.router.navigate(['/pets/create-pet']);
  }

  getNombreSeguro(nombre: string): string {
    return nombre?.trim() ? nombre : this.t('feed.choosePet.noName');
  }

  getRazaSegura(raza: string): string {
    return raza?.trim() ? raza : this.t('feed.choosePet.noBreed');
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}

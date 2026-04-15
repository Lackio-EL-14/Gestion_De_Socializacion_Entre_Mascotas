import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { TranslateModule } from '@ngx-translate/core';

interface Mascota {
  id_mascota: number;
  nombre: string;
  raza: string;
  tamano: string;
  edad: number;
  genero: string;
  estado_salud: string;
  vacuna_imagen_url: string | null;
  fecha_registro: string;
  id_usuario: number;
}

@Component({
  selector: 'app-list-pets',
  standalone: true, // Arquitectura Standalone
  imports: [CommonModule, RouterModule, BackButtonComponent, TranslateModule], // Inyecciones (no necesita FormsModule)
  templateUrl: './list-pets.component.html',
  styleUrl: './list-pets.component.scss'
})
export class ListPetsComponent implements OnInit {
  mascotas: Mascota[] = [];
  cargando = false;
  error = '';

  readonly imagenPlaceholder = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerMascotas();
  }

  obtenerMascotas(): void {
    const idUsuario = localStorage.getItem('id_usuario');
    const token = localStorage.getItem('access_token');

    if (!idUsuario || !token) {
      this.error = 'No se encontró un usuario logeado o falta el token de seguridad';
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
        this.error = 'No se pudieron cargar tus mascotas. Verifica tu sesión.';
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
    return raza?.trim() ? raza : 'Raza no especificada';
  }
}

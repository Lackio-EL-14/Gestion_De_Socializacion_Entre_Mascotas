import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

export interface Publication {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  status: 'Publicado' | 'Pendiente' | 'Rechazado';
}

@Component({
  selector: 'app-my-publications',
  standalone: false,
  templateUrl: './my-publications.html',
  styleUrl: './my-publications.scss'
})
export class MyPublicationsComponent implements OnInit {
  publications: Publication[] = [];
  cargando = false;
  errorMessage = '';

  constructor(
    private readonly http: HttpClient,
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.obtenerPublicaciones();
  }

  manejarErrorImagen(event: Event): void {
    const elemento = event.target as HTMLImageElement;
    elemento.onerror = null; // Corta el bucle infinito
    // SVG de repuesto seguro
    elemento.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22200%22%20viewBox%3D%220%200%20400%20200%22%3E%3Crect%20fill%3D%22%23e2e8f0%22%20width%3D%22400%22%20height%3D%22200%22%2F%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20alignment-baseline%3D%22middle%22%3ESin%20Imagen%3C%2Ftext%3E%3C%2Fsvg%3E';
  }

  obtenerPublicaciones(): void {
    // 1. Usamos la misma lógica de tu compañero para el token
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.errorMessage = 'No hay sesión activa. Inicia sesión nuevamente.';
      this.cargando = false;
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.errorMessage = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 2. Hacemos la petición
    this.http.get<Publication[]>('http://localhost:3000/publications/me', { headers }).subscribe({
      next: (response) => {
        // 3. Nos aseguramos de que siempre sea un Array (como tu compañero)
        this.publications = Array.isArray(response) ? response : [];
        this.cargando = false;

        // 4. Forzamos a Angular a repintar el HTML AHORA MISMO
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener tus publicaciones', error);
        this.errorMessage = 'No se pudieron cargar las publicaciones.';
        this.cargando = false;

        // 4. Forzamos a Angular a repintar el HTML AHORA MISMO
        this.cdr.detectChanges();
      }
    });
  }
}

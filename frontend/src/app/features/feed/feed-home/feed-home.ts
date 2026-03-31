import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs';

interface RandomPetResponse {
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
  foto_url?: string | null;
  imagen_url?: string | null;
}

@Component({
  selector: 'app-feed-home',
  standalone: false,
  templateUrl: './feed-home.html',
  styleUrl: './feed-home.scss',
})
export class FeedHome implements OnInit {
  private readonly apiBaseUrl = 'http://localhost:3000';

  currentUserId: number | null = null;
  pet: RandomPetResponse | null = null;
  isLoading = false;
  isLeaving = false;
  errorMessage = '';

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.currentUserId = this.getCurrentUserId();

    if (!this.currentUserId) {
      this.errorMessage =
        'No se encontro tu id de usuario en la sesion. Inicia sesion nuevamente.';
      return;
    }

    this.loadRandomPet();
  }

  loadNextPet(): void {
    if (!this.currentUserId || this.isLoading) {
      return;
    }

    this.isLeaving = true;
    setTimeout(() => {
      this.isLeaving = false;
      this.loadRandomPet();
    }, 250);
  }

  get photoUrl(): string {
    const image = this.pet?.foto_url ?? this.pet?.imagen_url;
    return image ?? '';
  }

  get hasPhoto(): boolean {
    return this.photoUrl.length > 0;
  }

  get vaccineCardUrl(): string | null {
    return this.pet?.vacuna_imagen_url ?? null;
  }

  get healthBadgeClass(): string {
    const health = this.pet?.estado_salud?.toLowerCase().trim() ?? '';
    return health.replace(/\s+/g, '-');
  }

  onVaccineCardClick(event: MouseEvent): void {
    if (!this.vaccineCardUrl) {
      event.preventDefault();
    }
  }

  private getCurrentUserId(): number | null {
    const rawId = localStorage.getItem('id_usuario');

    if (!rawId) {
      return null;
    }

    const parsedId = Number(rawId);
    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  }

  private loadRandomPet(): void {
    if (!this.currentUserId) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http
      .get<RandomPetResponse | null>(
        `${this.apiBaseUrl}/pets/random/${this.currentUserId}`,
      )
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (pet) => {
          this.pet = pet;

          if (!pet) {
            this.errorMessage =
              'No hay perritos disponibles para mostrar en este momento.';
          }
        },
        error: (error: HttpErrorResponse) => {
          this.pet = null;
          this.errorMessage =
            error.status === 404
              ? 'No hay perritos disponibles para mostrar en este momento.'
              : 'No se pudo cargar el perrito aleatorio. Intenta de nuevo.';
        },
      });
  }
}

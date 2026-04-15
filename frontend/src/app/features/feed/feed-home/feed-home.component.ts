import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Importado
import { finalize, TimeoutError, timeout } from 'rxjs'; // TimeoutError está deprecado en RxJS recientes, pero lo dejo por si tu versión lo soporta
import { TranslateModule } from '@ngx-translate/core';

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
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './feed-home.component.html',
  styleUrls: ['./feed-home.component.scss'],
})
export class FeedHomeComponent implements OnInit {
  private readonly apiBaseUrl = 'http://localhost:3000';
  private huesitoReactionTimer: ReturnType<typeof setTimeout> | null = null;

  currentUserId: number | null = null;
  pet: RandomPetResponse | null = null;
  isLoading = false;
  isLeaving = false;
  isHuesitoLiked = false;
  showHuesitoReaction = false;
  errorMessage = '';

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.getCurrentUserId();

    if (!this.currentUserId) {
      this.errorMessage = "{{ 'feed.errors.userIdNotFound' | translate }}";
      this.cdr.detectChanges();
      return;
    }

    this.loadRandomPet();
    this.cdr.detectChanges();
  }

  loadNextPet(): void {
    if (!this.currentUserId || this.isLoading) {
      return;
    }

    this.isLeaving = true;
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isLeaving = false;
      this.pet = null;
      this.cdr.detectChanges();
      this.loadRandomPet();
    }, 250);
  }

  onHuesitoClick(): void {
    this.isHuesitoLiked = true;
    this.showHuesitoReaction = true;
    this.cdr.detectChanges();

    if (this.huesitoReactionTimer) {
      clearTimeout(this.huesitoReactionTimer);
    }

    this.huesitoReactionTimer = setTimeout(() => {
      this.showHuesitoReaction = false;
      this.isHuesitoLiked = false;
      this.cdr.detectChanges();
    }, 850);
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
    if (!rawId) return null;
    const parsedId = Number(rawId);
    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  }

  private loadRandomPet(): void {
    if (!this.currentUserId) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.http
      .get<RandomPetResponse | null>(`${this.apiBaseUrl}/pets/random/${this.currentUserId}`)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (pet) => {
          this.pet = pet;
          if (!pet) {
            this.errorMessage = "{{ 'feed.errors.noPetsAvailable' | translate }}";
          }
          this.cdr.detectChanges();
        },
        error: (error: any) => { // Uso any para evitar problemas con la importación deprecada de TimeoutError
          this.pet = null;
          if (error.name === 'TimeoutError') {
            this.errorMessage = "{{ 'feed.errors.requestTimeout' | translate }}";
            this.cdr.detectChanges();
            return;
          }
          this.errorMessage = error.status === 404
            ? "{{ 'feed.errors.noPetsAvailable' | translate }}"
            : error.status === 0
              ? "{{ 'feed.errors.connectionFailed' | translate }}"
              : "{{ 'feed.errors.loadingPet' | translate }}";
          this.cdr.detectChanges();
        },
      });
  }
}

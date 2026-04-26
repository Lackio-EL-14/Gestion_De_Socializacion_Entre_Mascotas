import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TimeoutError, firstValueFrom, timeout } from 'rxjs';

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

interface FeedFilters {
  raza?: string;
  tamano?: string;
  estado_salud?: string;
  edad_min?: number;
  edad_max?: number;
  genero?: string;
}

interface MascotaOrigen {
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

interface InteractionResponse {
  match: boolean;
}

@Component({
  selector: 'app-feed-home',
  standalone: false,
  templateUrl: './feed-home.html',
  styleUrl: './feed-home.scss',
})
export class FeedHome implements OnInit, OnDestroy {
  private readonly apiBaseUrl = 'http://localhost:3000';
  private readonly maxFilterAttempts = 30;
  private readonly noFilteredPetsMessage =
    'No encontramos perritos con esos filtros. Prueba con otros criterios.';

  private huesitoReactionTimer: ReturnType<typeof setTimeout> | null = null;
  private loadRequestId = 0;

  currentUserId: number | null = null;
  pet: RandomPetResponse | null = null;
  activeFilters: FeedFilters = {};
  isLoading = false;
  isLeaving = false;
  isHuesitoLiked = false;
  showHuesitoReaction = false;
  errorMessage = '';

  misMascotas: MascotaOrigen[] = [];
  mascotaOrigenId: number | null = null;
  cargandoMisMascotas = false;
  errorMisMascotas = '';
  listaPerros: RandomPetResponse[] = [];

  matchModalVisible = false;
  matchNombreMascota = '';

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.getCurrentUserId();

    if (!this.currentUserId) {
      this.errorMessage = this.t('feed.errors.userIdNotFound');
      this.cdr.detectChanges();
      return;
    }

    this.obtenerMisMascotas();

    this.route.queryParamMap.subscribe((params) => {
      this.activeFilters = this.parseFilters(params);
      void this.loadPet();
    });

    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.huesitoReactionTimer) {
      clearTimeout(this.huesitoReactionTimer);
    }

    this.loadRequestId += 1;
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }

  loadNextPet(): void {
    if (!this.currentUserId || this.isLoading || !this.mascotaOrigenId || !this.pet) {
      return;
    }

    this.registrarInteraccion('REJECT');
  }

  onHuesitoClick(): void {
    if (!this.mascotaOrigenId || !this.pet || this.isLoading) {
      return;
    }

    this.registrarInteraccion('LIKE');
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

  goToReport(): void {
    if (!this.pet?.id_usuario) {
      return;
    }

    this.router.navigate(['/reports/create-report'], {
      state: { id_usuario_reported: this.pet.id_usuario },
    });
  }

  private async loadPet(): Promise<void> {
    if (!this.mascotaOrigenId) {
      this.pet = null;
      this.errorMessage = this.t('feed.selector.help');
      this.cdr.detectChanges();
      return;
    }

    const requestId = ++this.loadRequestId;

    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      if (this.listaPerros.length === 0) {
        const perros = await this.requestFeedPets(this.mascotaOrigenId);

        if (requestId !== this.loadRequestId) {
          return;
        }

        this.listaPerros = this.hasActiveFilters()
          ? perros.filter(perro => this.matchesFilters(perro))
          : perros;
      }

      this.pet = this.listaPerros.shift() || null;

      if (!this.pet) {
        this.errorMessage = this.hasActiveFilters()
          ? this.noFilteredPetsMessage
          : this.t('feed.errors.noPetsAvailable');
      }
    } catch (error) {
      if (requestId !== this.loadRequestId) {
        return;
      }

      this.pet = null;
      this.errorMessage = this.resolveLoadError(error);
    } finally {
      if (requestId !== this.loadRequestId) {
        return;
      }

      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  private async requestFeedPets(idMascotaOrigen: number): Promise<RandomPetResponse[]> {
    return firstValueFrom(
      this.http
        .get<RandomPetResponse[]>(`${this.apiBaseUrl}/pets/feed/${idMascotaOrigen}`)
        .pipe(timeout(10000)),
    );
  }

  private resolveLoadError(error: unknown): string {
    if (error instanceof TimeoutError) {
      return this.t('feed.errors.requestTimeout');
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 404) {
        return this.t('feed.errors.noPetsAvailable');
      }

      if (error.status === 0) {
        return this.t('feed.errors.connectionFailed');
      }
    }

    return this.t('feed.errors.loadFailed');
  }

  private hasActiveFilters(): boolean {
    return Object.keys(this.activeFilters).length > 0;
  }

  private parseFilters(params: ParamMap): FeedFilters {
    const filters: FeedFilters = {};

    const raza = params.get('raza');
    const tamano = params.get('tamano');
    const estadoSalud = params.get('estado_salud');
    const genero = params.get('genero');

    if (raza?.trim()) {
      filters.raza = raza;
    }

    if (tamano?.trim()) {
      filters.tamano = tamano;
    }

    if (estadoSalud?.trim()) {
      filters.estado_salud = estadoSalud;
    }

    if (genero?.trim()) {
      filters.genero = genero;
    }

    const edadMin = this.parseAgeParam(params.get('edad_min'));
    const edadMax = this.parseAgeParam(params.get('edad_max'));

    if (edadMin !== null) {
      filters.edad_min = edadMin;
    }

    if (edadMax !== null) {
      filters.edad_max = edadMax;
    }

    return filters;
  }

  private parseAgeParam(rawValue: string | null): number | null {
    if (!rawValue) {
      return null;
    }

    const parsed = Number(rawValue);

    if (!Number.isFinite(parsed)) {
      return null;
    }

    return Math.max(0, Math.floor(parsed));
  }

  private matchesFilters(pet: RandomPetResponse): boolean {
    const petRaza = this.normalizeText(pet.raza);
    const petTamano = this.normalizeText(pet.tamano);
    const petEstadoSalud = this.normalizeText(pet.estado_salud);

    if (this.activeFilters.raza) {
      const filterRaza = this.normalizeText(this.activeFilters.raza);
      if (petRaza !== filterRaza) {
        return false;
      }
    }

    if (this.activeFilters.tamano) {
      const filterTamano = this.normalizeText(this.activeFilters.tamano);
      if (petTamano !== filterTamano) {
        return false;
      }
    }

    if (this.activeFilters.estado_salud) {
      const filterEstadoSalud = this.normalizeText(this.activeFilters.estado_salud);
      if (petEstadoSalud !== filterEstadoSalud) {
        return false;
      }
    }

    if (this.activeFilters.genero) {
      const petGenero = this.normalizeText(pet.genero);
      const filterGenero = this.normalizeText(this.activeFilters.genero);
      if (petGenero !== filterGenero) {
        return false;
      }
    }

    if (
      this.activeFilters.edad_min !== undefined &&
      pet.edad < this.activeFilters.edad_min
    ) {
      return false;
    }

    if (
      this.activeFilters.edad_max !== undefined &&
      pet.edad > this.activeFilters.edad_max
    ) {
      return false;
    }

    return true;
  }

  private normalizeText(value: string): string {
    return value
      .toLowerCase()
      .replace(/[_\s]+/g, ' ')
      .trim();
  }

  private getCurrentUserId(): number | null {
    const rawId = localStorage.getItem('id_usuario');

    if (!rawId) {
      return null;
    }

    const parsedId = Number(rawId);
    return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
  }

  obtenerMisMascotas(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.errorMisMascotas = this.t('feed.errors.noSession');
      return;
    }

    this.cargandoMisMascotas = true;
    this.errorMisMascotas = '';

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<MascotaOrigen[] | MascotaOrigen>(`${this.apiBaseUrl}/pets/my-pets`, { headers })
      .subscribe({
        next: (respuesta) => {
          this.misMascotas = Array.isArray(respuesta) ? respuesta : [respuesta];

          if (this.misMascotas.length === 1) {
            this.mascotaOrigenId = this.misMascotas[0].id_mascota;
            void this.loadPet();
          }

          this.cargandoMisMascotas = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al cargar mis mascotas:', error);
          this.errorMisMascotas = this.t('feed.errors.myPetsLoadFailed');
          this.cargandoMisMascotas = false;
          this.cdr.detectChanges();
        }
      });
  }

  private registrarInteraccion(tipoAccion: 'LIKE' | 'REJECT'): void {
    if (!this.mascotaOrigenId || !this.pet) {
      return;
    }

    const body = {
      id_mascota_origen: this.mascotaOrigenId,
      id_mascota_destino: this.pet.id_mascota,
      tipo_accion: tipoAccion
    };

    const nombreMascotaDestino = this.pet.nombre;

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<InteractionResponse>(`${this.apiBaseUrl}/interactions`, body)
      .subscribe({
        next: (respuesta) => {
          if (tipoAccion === 'LIKE') {
            this.dispararAnimacionHuesito();

            if (respuesta.match === true) {
              this.matchNombreMascota = nombreMascotaDestino;
              this.matchModalVisible = true;
              this.isLoading = false;
              this.cdr.detectChanges();
              return;
            }
          }

          this.avanzarSiguienteMascota();
        },
        error: (error) => {
          console.error('Error al registrar interacción:', error);
          this.errorMessage = this.t('feed.errors.interactionFailed');
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  private dispararAnimacionHuesito(): void {
    this.isHuesitoLiked = true;
    this.showHuesitoReaction = true;

    if (this.huesitoReactionTimer) {
      clearTimeout(this.huesitoReactionTimer);
    }

    this.huesitoReactionTimer = setTimeout(() => {
      this.showHuesitoReaction = false;
      this.isHuesitoLiked = false;
      this.cdr.detectChanges();
    }, 850);
  }

  private avanzarSiguienteMascota(): void {
    this.isLeaving = true;
    this.cdr.detectChanges();

    setTimeout(() => {
      this.isLeaving = false;
      this.pet = null;
      this.cdr.detectChanges();
      void this.loadPet();
    }, 250);
  }

  cerrarMatchModal(): void {
    this.matchModalVisible = false;
    this.matchNombreMascota = '';
    this.avanzarSiguienteMascota();
  }

  onMascotaOrigenChange(): void {
    this.listaPerros = [];
    this.pet = null;
    this.errorMessage = '';

    if (!this.mascotaOrigenId) {
      return;
    }

    void this.loadPet();
  }
}


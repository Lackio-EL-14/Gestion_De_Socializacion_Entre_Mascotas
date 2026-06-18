import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import {
  RecommendationEvent,
  RecommendationPet,
  RecommendationsResponse,
} from '../models/recommendations.models';
import { RecommendationsService } from '../services/recommendations.service';

@Component({
  selector: 'app-recommendations-view',
  standalone: false,
  templateUrl: './recommendations-view.html',
  styleUrl: './recommendations-view.scss'
})
export class RecommendationsViewComponent implements OnInit {
  readonly idRolUsuario = Number(localStorage.getItem('id_rol'));

  recommendations: RecommendationsResponse | null = null;
  isLoading = false;
  errorMessage = '';

  private readonly petPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80';

  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  get esOwner(): boolean {
    return this.idRolUsuario === 1;
  }

  get esAdmin(): boolean {
    return this.idRolUsuario === 2;
  }

  get esWorker(): boolean {
    return this.idRolUsuario === 3;
  }

  get isFallbackRecommendation(): boolean {
    return this.recommendations?.tipo_recomendacion === 'FALLBACK_ALEATORIO';
  }

  get hasStats(): boolean {
    return !!this.recommendations?.estadisticas_base;
  }

  get recommendedEvents(): RecommendationEvent[] {
    return this.recommendations?.eventos ?? [];
  }

  get suggestedPets(): RecommendationPet[] {
    return this.recommendations?.mascotas ?? [];
  }

  get favoriteActivities(): string[] {
    return this.recommendations?.estadisticas_base?.actividades_favoritas ?? [];
  }

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.errorMessage = this.t('recommendations.errors.noSession');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.recommendationsService.getRecommendations(token).subscribe({
      next: (response) => {
        this.recommendations = response;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        this.recommendations = null;
        this.isLoading = false;
        this.errorMessage = this.extractErrorMessage(error);
        this.cdr.detectChanges();
      }
    });
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status?.toLowerCase().trim() ?? '';
    return normalizedStatus || 'desconocido';
  }

  getPetImage(url: string | null | undefined): string {
    return url?.trim() ? url : this.petPlaceholder;
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return this.t('recommendations.errors.connection');
    }

    const backendMessage = error?.error?.message;

    if (Array.isArray(backendMessage) && backendMessage.length > 0) {
      return backendMessage.join(', ');
    }

    if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
      return backendMessage;
    }

    return this.t('recommendations.errors.load');
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }
}

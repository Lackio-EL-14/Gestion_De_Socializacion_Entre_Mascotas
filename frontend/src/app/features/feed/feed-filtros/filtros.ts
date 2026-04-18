import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface FeedFiltersForm {
  raza: string;
  edad_min: string;
  edad_max: string;
  tamano: string;
  estado_salud: string;
  genero: string;
}

@Component({
  selector: 'app-feed-filtros',
  standalone: false,
  templateUrl: './filtros.html',
  styleUrls: ['./filtros.scss'],
})
export class Filtros implements OnInit {
  filters: FeedFiltersForm = {
    raza: '',
    edad_min: '',
    edad_max: '',
    tamano: '',
    estado_salud: '',
    genero: '',
  };

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;

    this.filters = {
      raza: params.get('raza') ?? '',
      edad_min: params.get('edad_min') ?? '',
      edad_max: params.get('edad_max') ?? '',
      tamano: params.get('tamano') ?? '',
      estado_salud: params.get('estado_salud') ?? '',
      genero: params.get('genero') ?? '',
    };
  }

  applyFilters(event: Event): void {
    event.preventDefault();

    let edadMin = this.toValidAge(this.filters.edad_min);
    let edadMax = this.toValidAge(this.filters.edad_max);

    if (edadMin !== null && edadMax !== null && edadMin > edadMax) {
      [edadMin, edadMax] = [edadMax, edadMin];
    }

    const queryParams: Record<string, string | number> = {};

    if (this.filters.raza.trim()) {
      queryParams['raza'] = this.filters.raza.trim();
    }

    if (this.filters.tamano.trim()) {
      queryParams['tamano'] = this.filters.tamano.trim();
    }

    if (this.filters.estado_salud.trim()) {
      queryParams['estado_salud'] = this.filters.estado_salud.trim();
    }

    if (this.filters.genero.trim()) {
      queryParams['genero'] = this.filters.genero.trim();
    }

    if (edadMin !== null) {
      queryParams['edad_min'] = edadMin;
    }

    if (edadMax !== null) {
      queryParams['edad_max'] = edadMax;
    }

    this.router.navigate(['/feed'], { queryParams });
  }

  clearFilters(): void {
    this.filters = {
      raza: '',
      edad_min: '',
      edad_max: '',
      tamano: '',
      estado_salud: '',
      genero: '',
    };

    this.router.navigate(['/feed']);
  }

  private toValidAge(rawValue: string): number | null {
    if (!rawValue.trim()) {
      return null;
    }

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
      return null;
    }

    return Math.max(0, Math.floor(value));
  }
}

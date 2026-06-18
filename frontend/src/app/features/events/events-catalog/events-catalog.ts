import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

interface EventCreator {
  id_usuario: number;
  nombre: string;
}

interface EventItem {
  id_evento: number;
  nombre: string;
  descripcion: string;
  fecha_hora: string;
  direccion: string;
  latitud?: number | null;
  longitud?: number | null;
  tipo_actividad: string;
  capacidad_maxima: number;
  asistentes_actuales: number;
  estado_evento: 'ACTIVO' | 'FINALIZADO' | 'CANCELADO';
  creador?: EventCreator;
}

interface EventMapItem {
  id_evento: number;
  latitud: number;
  longitud: number;
}

@Component({
  selector: 'app-events-catalog',
  standalone: false,
  templateUrl: './events-catalog.html',
  styleUrl: './events-catalog.scss'
})
export class EventsCatalogComponent implements OnInit {
  private readonly apiBaseUrl = 'http://localhost:3000';

  events: EventItem[] = [];
  filterFromDate = '';
  filterToDate = '';
  isLoading = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';
  selectedEvent: EventItem | null = null;
  readonly idRolUsuario = Number(localStorage.getItem('id_rol'));
  private readonly currentUserId = Number(localStorage.getItem('id_usuario') || 0);
  private readonly confirmedEventIds = new Set<number>();
  private readonly processingEventIds = new Set<number>();
  private readonly mapCoordinatesByEventId = new Map<number, { latitud: number; longitud: number }>();

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService,
    private readonly sanitizer: DomSanitizer
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

  get hasEvents(): boolean {
    return this.filteredEvents.length > 0;
  }

  get filteredEvents(): EventItem[] {
    return this.events.filter((event) => {
      const eventDate = new Date(event.fecha_hora);

      if (Number.isNaN(eventDate.getTime())) {
        return false;
      }

      if (this.filterFromDate) {
        const from = new Date(`${this.filterFromDate}T00:00:00`);
        if (eventDate < from) {
          return false;
        }
      }

      if (this.filterToDate) {
        const to = new Date(`${this.filterToDate}T23:59:59`);
        if (eventDate > to) {
          return false;
        }
      }

      return true;
    });
  }

  clearDateFilters(): void {
    this.filterFromDate = '';
    this.filterToDate = '';
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.feedbackMessage = '';

    this.http.get<EventItem[]>(`${this.apiBaseUrl}/events`).subscribe({
      next: (response) => {
        this.events = Array.isArray(response) ? response : [];
        this.loadEventsForMapCoordinates();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.events = [];
        this.isLoading = false;
        this.showFeedback(this.t('events.catalog.messages.loadError'), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  isConfirmed(eventId: number): boolean {
    return this.confirmedEventIds.has(eventId);
  }

  isProcessing(eventId: number): boolean {
    return this.processingEventIds.has(eventId);
  }

  getAvailableSpots(event: EventItem): number {
    return Math.max(0, event.capacidad_maxima - event.asistentes_actuales);
  }

  canAttend(event: EventItem): boolean {
    if (event.estado_evento !== 'ACTIVO') {
      return false;
    }

    return this.getAvailableSpots(event) > 0 || this.isConfirmed(event.id_evento);
  }

  toggleAttendance(event: EventItem): void {
    if (this.currentUserId <= 0) {
      this.showFeedback(this.t('events.catalog.messages.noSession'), 'error');
      return;
    }

    if (this.isProcessing(event.id_evento)) {
      return;
    }

    if (this.isConfirmed(event.id_evento)) {
      this.cancelAttendance(event);
      return;
    }

    this.confirmAttendance(event);
  }

  private confirmAttendance(event: EventItem): void {
    this.processingEventIds.add(event.id_evento);

    this.http.post(
      `${this.apiBaseUrl}/events/attend`,
      { id_evento: event.id_evento, id_usuario: this.currentUserId },
      { headers: this.buildHeaders() }
    ).subscribe({
      next: () => {
        this.confirmedEventIds.add(event.id_evento);
        event.asistentes_actuales += 1;
        this.processingEventIds.delete(event.id_evento);
        this.showFeedback(this.t('events.catalog.messages.attendanceConfirmed'), 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al confirmar asistencia:', error);
        this.processingEventIds.delete(event.id_evento);
        this.showFeedback(this.extractBackendMessage(error, this.t('events.catalog.messages.attendanceError')), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  private cancelAttendance(event: EventItem): void {
    this.processingEventIds.add(event.id_evento);

    this.http.delete(
      `${this.apiBaseUrl}/events/${event.id_evento}/attend/${this.currentUserId}`,
      { headers: this.buildHeaders() }
    ).subscribe({
      next: () => {
        this.confirmedEventIds.delete(event.id_evento);
        event.asistentes_actuales = Math.max(0, event.asistentes_actuales - 1);
        this.processingEventIds.delete(event.id_evento);
        this.showFeedback(this.t('events.catalog.messages.attendanceCancelled'), 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cancelar asistencia:', error);
        this.processingEventIds.delete(event.id_evento);
        this.showFeedback(this.extractBackendMessage(error, this.t('events.catalog.messages.cancelError')), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  private buildHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private extractBackendMessage(error: any, fallback: string): string {
    const backendMessage = error?.error?.message;

    if (Array.isArray(backendMessage)) {
      return backendMessage.join(' ');
    }

    if (typeof backendMessage === 'string' && backendMessage.trim().length > 0) {
      return backendMessage;
    }

    return fallback;
  }

  private showFeedback(message: string, type: 'success' | 'error'): void {
    this.feedbackMessage = message;
    this.feedbackType = type;
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }

  openModal(event: EventItem): void {
    this.selectedEvent = event;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedEvent = null;
    document.body.style.overflow = 'auto';
  }

  hasCoordinates(event: EventItem): boolean {
    return !!this.getCoordinates(event);
  }

  getEventMapEmbedUrl(event: EventItem): SafeResourceUrl | null {
    const coordinates = this.getCoordinates(event);

    if (!coordinates) {
      return null;
    }

    const lat = Number(coordinates.latitud.toFixed(6));
    const lng = Number(coordinates.longitud.toFixed(6));
    const delta = 0.008;
    const left = (lng - delta).toFixed(6);
    const right = (lng + delta).toFixed(6);
    const top = (lat + delta).toFixed(6);
    const bottom = (lat - delta).toFixed(6);
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lng}`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
  }

  getOpenStreetMapUrl(event: EventItem): string | null {
    const coordinates = this.getCoordinates(event);

    if (!coordinates) {
      return null;
    }

    const lat = Number(coordinates.latitud.toFixed(6));
    const lng = Number(coordinates.longitud.toFixed(6));
    return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
  }

  getGoogleMapsUrl(event: EventItem): string | null {
    const coordinates = this.getCoordinates(event);

    if (!coordinates) {
      return null;
    }

    const lat = Number(coordinates.latitud.toFixed(6));
    const lng = Number(coordinates.longitud.toFixed(6));
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  private loadEventsForMapCoordinates(): void {
    this.http.get<EventMapItem[]>(`${this.apiBaseUrl}/events/map`).subscribe({
      next: (response) => {
        this.mapCoordinatesByEventId.clear();

        const items = Array.isArray(response) ? response : [];
        items.forEach((eventMapItem) => {
          const lat = Number(eventMapItem.latitud);
          const lng = Number(eventMapItem.longitud);

          if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return;
          }

          this.mapCoordinatesByEventId.set(eventMapItem.id_evento, { latitud: lat, longitud: lng });
        });

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar coordenadas de eventos para mapa:', error);
      },
    });
  }

  private getCoordinates(event: EventItem): { latitud: number; longitud: number } | null {
    const fromMapEndpoint = this.mapCoordinatesByEventId.get(event.id_evento);
    if (fromMapEndpoint) {
      return fromMapEndpoint;
    }

    if (event.latitud === null || event.latitud === undefined || event.longitud === null || event.longitud === undefined) {
      return null;
    }

    const lat = Number(event.latitud);
    const lng = Number(event.longitud);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return null;
    }

    return { latitud: lat, longitud: lng };
  }
}

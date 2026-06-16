import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface CreateEventRequest {
  nombre: string;
  descripcion: string;
  fecha_hora: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  tipo_actividad: string;
  capacidad_maxima: number;
  id_usuario_creador: number;
}

interface EventFormData {
  nombre: string | number;
  descripcion: string | number;
  fecha_hora: string | number;
  direccion: string | number;
  latitud: string | number;
  longitud: string | number;
  tipo_actividad: string | number;
  capacidad_maxima: string | number;
}

@Component({
  selector: 'app-event-manage-form',
  standalone: false,
  templateUrl: './event-manage-form.html',
  styleUrl: './event-manage-form.scss'
})
export class EventManageFormComponent {
  private readonly apiBaseUrl = 'http://localhost:3000';

  readonly idRolUsuario = Number(localStorage.getItem('id_rol'));

  form: EventFormData = {
    nombre: '',
    descripcion: '',
    fecha_hora: '',
    direccion: '',
    latitud: '',
    longitud: '',
    tipo_actividad: '',
    capacidad_maxima: '',
  };

  fieldErrors: Record<keyof EventFormData, string> = {
    nombre: '',
    descripcion: '',
    fecha_hora: '',
    direccion: '',
    latitud: '',
    longitud: '',
    tipo_actividad: '',
    capacidad_maxima: '',
  };

  isSubmitting = false;
  feedbackMessage = '';
  feedbackType: 'success' | 'error' = 'success';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly translate: TranslateService,
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

  onFieldChange(field: keyof EventFormData): void {
    this.validateField(field);
  }

  validateField(field: keyof EventFormData): void {
    const value = this.toText(this.form[field]);
    this.fieldErrors[field] = '';

    switch (field) {
      case 'nombre':
        if (!value) {
          this.fieldErrors[field] = this.t('events.form.validation.required');
        } else if (value.length < 4) {
          this.fieldErrors[field] = this.t('events.form.validation.minName');
        }
        break;
      case 'descripcion':
        if (!value) {
          this.fieldErrors[field] = this.t('events.form.validation.required');
        } else if (value.length < 15) {
          this.fieldErrors[field] = this.t('events.form.validation.minDescription');
        }
        break;
      case 'fecha_hora':
        if (!value) {
          this.fieldErrors[field] = this.t('events.form.validation.required');
          return;
        }

        if (Number.isNaN(new Date(value).getTime())) {
          this.fieldErrors[field] = this.t('events.form.validation.invalidDate');
          return;
        }

        if (new Date(value) <= new Date()) {
          this.fieldErrors[field] = this.t('events.form.validation.futureDate');
        }
        break;
      case 'direccion':
        if (!value) {
          this.fieldErrors[field] = this.t('events.form.validation.required');
        }
        break;
      case 'tipo_actividad':
        if (!value) {
          this.fieldErrors[field] = this.t('events.form.validation.required');
        }
        break;
      case 'capacidad_maxima': {
        if (!value) {
          this.fieldErrors[field] = this.t('events.form.validation.required');
          return;
        }

        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed < 1) {
          this.fieldErrors[field] = this.t('events.form.validation.capacity');
        }
        break;
      }
      case 'latitud': {
        if (!value) {
          return;
        }

        const parsed = Number(value);
        if (Number.isNaN(parsed) || parsed < -90 || parsed > 90) {
          this.fieldErrors[field] = this.t('events.form.validation.latitude');
        }
        break;
      }
      case 'longitud': {
        if (!value) {
          return;
        }

        const parsed = Number(value);
        if (Number.isNaN(parsed) || parsed < -180 || parsed > 180) {
          this.fieldErrors[field] = this.t('events.form.validation.longitude');
        }
        break;
      }
      default:
        break;
    }
  }

  submit(): void {
    if (this.isSubmitting) {
      return;
    }

    const fields = Object.keys(this.form) as Array<keyof EventFormData>;
    fields.forEach((field) => this.validateField(field));

    const hasErrors = fields.some((field) => this.fieldErrors[field]);
    if (hasErrors) {
      this.showFeedback(this.t('events.form.messages.validationError'), 'error');
      return;
    }

    const idUsuarioCreador = Number(localStorage.getItem('id_usuario') || 0);
    if (idUsuarioCreador <= 0) {
      this.showFeedback(this.t('events.form.messages.noSession'), 'error');
      return;
    }

    const payload: CreateEventRequest = {
      nombre: this.toText(this.form.nombre),
      descripcion: this.toText(this.form.descripcion),
      fecha_hora: new Date(this.toText(this.form.fecha_hora)).toISOString(),
      direccion: this.toText(this.form.direccion),
      tipo_actividad: this.toText(this.form.tipo_actividad),
      capacidad_maxima: Number(this.toText(this.form.capacidad_maxima)),
      id_usuario_creador: idUsuarioCreador,
      ...(this.toText(this.form.latitud) ? { latitud: Number(this.toText(this.form.latitud)) } : {}),
      ...(this.toText(this.form.longitud) ? { longitud: Number(this.toText(this.form.longitud)) } : {}),
    };

    this.isSubmitting = true;
    this.feedbackMessage = '';

    this.http.post(`${this.apiBaseUrl}/events`, payload, { headers: this.buildHeaders() }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showFeedback(this.t('events.form.messages.success'), 'success');
        this.form = {
          nombre: '',
          descripcion: '',
          fecha_hora: '',
          direccion: '',
          latitud: '',
          longitud: '',
          tipo_actividad: '',
          capacidad_maxima: '',
        };
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear evento:', error);
        this.isSubmitting = false;
        this.showFeedback(this.extractBackendMessage(error, this.t('events.form.messages.error')), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  goToCatalog(): void {
    this.router.navigate(['/events']);
  }

  hasFieldError(field: keyof EventFormData): boolean {
    return !!this.fieldErrors[field];
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

  private toText(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value).trim();
  }
}

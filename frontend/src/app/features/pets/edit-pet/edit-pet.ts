import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

interface UpdatePetRequest {
  nombre?: string;
  raza?: string;
  tamano?: string;
  genero?: string;
  edad?: number;
  estado_salud?: string;
  vacuna_imagen_url?: string;
}

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
  selector: 'app-edit-pet',
  standalone: false,
  templateUrl: './edit-pet.html',
  styleUrl: './edit-pet.scss'
})
export class EditPetComponent implements OnInit {
  idMascota: number | null = null;

  nombre = '';
  raza = '';
  tamano = '';
  genero = '';
  edad: number | null = null;
  estado_salud = 'saludable';
  vacuna_imagen_url: string | null = null;

  readonly imagenPlaceholder =
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';

  cargando = false;
  enviando = false;

  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(Number(id))) {
      this.mostrarModalByKey('pets.common.errorTitle', 'pets.edit.errors.invalidId', 'error');
      return;
    }

    this.idMascota = Number(id);
    this.cargarMascota();
  }

cargarMascota(): void {
  const token = localStorage.getItem('access_token');

  if (!token) {
    this.mostrarModalByKey('pets.common.errorTitle', 'pets.edit.errors.missingToken', 'error');
    return;
  }

  this.cargando = true;

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<Mascota[] | Mascota>(
    'http://localhost:3000/pets/my-pets',
    { headers }
  ).subscribe({
    next: (respuesta) => {
      const mascotas = Array.isArray(respuesta) ? respuesta : [respuesta];
      const mascota = mascotas.find(m => m.id_mascota === this.idMascota);

      if (!mascota) {
        this.cargando = false;
        this.mostrarModalByKey('pets.common.errorTitle', 'pets.edit.errors.notFound', 'error');
        this.cdr.detectChanges();
        return;
      }

      this.nombre = mascota.nombre || '';
      this.raza = mascota.raza || '';
      this.tamano = mascota.tamano || '';
      this.genero = mascota.genero || '';
      this.edad = mascota.edad;
      this.estado_salud = mascota.estado_salud || 'saludable';
      this.vacuna_imagen_url = mascota.vacuna_imagen_url;

      this.cargando = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error al cargar la mascota:', error);
      this.cargando = false;
      this.mostrarModalByKey('pets.common.errorTitle', 'pets.edit.errors.loadFailed', 'error');
      this.cdr.detectChanges();
    }
  });
}

  submit(): void {
    if (!this.idMascota) {
      this.mostrarModalByKey('pets.common.errorTitle', 'pets.edit.errors.invalidId', 'error');
      return;
    }

    const nombre = this.nombre.trim();
    const raza = this.raza.trim();
    const tamano = this.tamano.trim();
    const genero = this.genero.trim();
    const edad = this.edad;
    const estado_salud = this.estado_salud.trim();

    if (!nombre) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.edit.validation.nameRequired', 'error');
      return;
    }
    if (!raza) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.edit.validation.breedRequired', 'error');
      return;
    }
    if (!tamano) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.edit.validation.sizeRequired', 'error');
      return;
    }
    if (!genero) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.edit.validation.genderRequired', 'error');
      return;
    }
    if (edad === null || isNaN(edad)) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.edit.validation.ageRequired', 'error');
      return;
    }

    const body: UpdatePetRequest = {
      nombre,
      raza,
      tamano,
      genero,
      edad,
      estado_salud,
      vacuna_imagen_url: this.vacuna_imagen_url || ''
    };

    this.enviando = true;

    this.http.patch(`http://localhost:3000/pets/${this.idMascota}`, body).subscribe({
      next: () => {
        this.enviando = false;
        this.mostrarModalByKey('pets.edit.modal.successTitle', 'pets.edit.modal.successMessage', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al actualizar la mascota:', error);
        const mensaje = error?.error?.message || this.t('pets.edit.modal.errorMessage');
        this.enviando = false;
        this.mostrarModal(this.t('pets.common.errorTitle'), Array.isArray(mensaje) ? mensaje.join('\n') : mensaje, 'error');
        this.cdr.detectChanges();
      }
    });
  }

  private t(key: string): string {
    return this.translate.instant(key);
  }

  private mostrarModalByKey(titleKey: string, messageKey: string, tipo: 'success' | 'error'): void {
    this.mostrarModal(this.t(titleKey), this.t(messageKey), tipo);
  }

  mostrarModal(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = tipo;
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;

    if (this.modalTipo === 'success') {
      this.router.navigate(['/pets/list-pets']);
    }
  }
}
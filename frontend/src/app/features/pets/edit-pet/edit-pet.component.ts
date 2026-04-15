import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertModalComponent } from '../../../shared/components/alert-modal/alert-modal.component';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button.component';
import { TranslateModule } from '@ngx-translate/core';
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
  standalone: true, // Arquitectura Standalone
  imports: [CommonModule, FormsModule, RouterModule, AlertModalComponent, BackButtonComponent, TranslateModule], // Inyecciones
  templateUrl: './edit-pet.component.html',
  styleUrl: './edit-pet.component.scss'
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

  readonly imagenPlaceholder = 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(Number(id))) {
      this.mostrarModal("{{pets.common.errorTitle|translate}}", "{{'pets.edit.errors.invalidId' | translate}}", 'error');
      return;
    }
    this.idMascota = Number(id);
    this.cargarMascota();
  }

  cargarMascota(): void {
    const token = localStorage.getItem('access_token');

    if (!token) {
      this.mostrarModal("{{pets.common.errorTitle|translate}}", "{{'pets.edit.errors.missingToken' | translate}}", 'error');
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
          this.mostrarModal("{{pets.common.errorTitle|translate}}", "{{'pets.edit.errors.notFound' | translate}}", 'error');
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
        this.mostrarModal("{{pets.common.errorTitle|translate}}", "{{'pets.edit.errors.loadFailed' | translate}}", 'error');
        this.cdr.detectChanges();
      }
    });
  }

  submit(): void {
    if (!this.idMascota) {
      this.mostrarModal("{{pets.common.errorTitle|translate}}", "{{'pets.edit.errors.invalidId' | translate}}", 'error');
      return;
    }

    const nombre = this.nombre.trim();
    const raza = this.raza.trim();
    const tamano = this.tamano.trim();
    const genero = this.genero.trim();
    const edad = this.edad;
    const estado_salud = this.estado_salud.trim();

    if (!nombre) {
      this.mostrarModal("{{pets.common.validationTitle|translate}}", "{{'pets.edit.errors.nameRequired' | translate}}", 'error');
      return;
    }
    if (!raza) {
      this.mostrarModal("{{pets.common.validationTitle|translate}}", "{{'pets.edit.errors.breedRequired' | translate}}", 'error');
      return;
    }
    if (!tamano) {
      this.mostrarModal("{{pets.common.validationTitle|translate}}", "{{'pets.edit.errors.sizeRequired' | translate}}", 'error');
      return;
    }
    if (!genero) {
      this.mostrarModal("{{pets.common.validationTitle|translate}}", "{{'pets.edit.errors.genderRequired' | translate}}", 'error');
      return;
    }
    if (edad === null || isNaN(edad)) {
      this.mostrarModal("{{pets.common.validationTitle|translate}}", "{{'pets.edit.errors.ageRequired' | translate}}", 'error');
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
        this.mostrarModal("{{pets.edit.modal.successTitle|translate}}", "{{'pets.edit.modal.successMessage' | translate}}", 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al actualizar la mascota:', error);
        const mensaje = error?.error?.message || "{{'pets.edit.modal.errorMessage' | translate}}";
        this.enviando = false;
        this.mostrarModal("{{pets.common.errorTitle|translate}}", Array.isArray(mensaje) ? mensaje.join('\n') : mensaje, 'error');
        this.cdr.detectChanges();
      }
    });
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

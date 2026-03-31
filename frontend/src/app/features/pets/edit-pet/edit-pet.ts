import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(Number(id))) {
      this.mostrarModal('Error', 'ID de mascota inválido', 'error');
      return;
    }

    this.idMascota = Number(id);
    this.cargarMascota();
  }

  cargarMascota(): void {
    const idUsuario = localStorage.getItem('id_usuario');

    if (!idUsuario) {
      this.mostrarModal('Error', 'No se encontró un usuario logeado', 'error');
      return;
    }

    this.cargando = true;

    this.http.get<Mascota[] | Mascota>(
      `http://localhost:3000/pets/user/${idUsuario}?t=${Date.now()}`
    ).subscribe({
      next: (respuesta) => {
        const mascotas = Array.isArray(respuesta) ? respuesta : [respuesta];
        const mascota = mascotas.find(m => m.id_mascota === this.idMascota);

        if (!mascota) {
          this.cargando = false;
          this.mostrarModal('Error', 'Mascota no encontrada', 'error');
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
        this.mostrarModal('Error', 'No se pudo cargar la mascota', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  submit(): void {
    if (!this.idMascota) {
      this.mostrarModal('Error', 'ID de mascota inválido', 'error');
      return;
    }

    const nombre = this.nombre.trim();
    const raza = this.raza.trim();
    const tamano = this.tamano.trim();
    const genero = this.genero.trim();
    const edad = this.edad;
    const estado_salud = this.estado_salud.trim();

    if (!nombre) {
      this.mostrarModal('Error de validación', 'El nombre es obligatorio', 'error');
      return;
    }
    if (!raza) {
      this.mostrarModal('Error de validación', 'La raza es obligatoria', 'error');
      return;
    }
    if (!tamano) {
      this.mostrarModal('Error de validación', 'El tamaño es obligatorio', 'error');
      return;
    }
    if (!genero) {
      this.mostrarModal('Error de validación', 'El género es obligatorio', 'error');
      return;
    }
    if (edad === null || isNaN(edad)) {
      this.mostrarModal('Error de validación', 'La edad es obligatoria y debe ser un número válido', 'error');
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
        this.mostrarModal('Éxito', 'La mascota ha sido actualizada exitosamente', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al actualizar la mascota:', error);
        const mensaje = error?.error?.message || 'Hubo un error al actualizar la mascota';
        this.enviando = false;
        this.mostrarModal('Error', Array.isArray(mensaje) ? mensaje.join('\n') : mensaje, 'error');
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
import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

interface CreatePetRequest {
  nombre: string;
  raza: string;
  tamano: string;
  genero: string;
  edad: number;
  estado_salud: string;
  vacuna_imagen_url: string;
  id_usuario: number | null;
}
@Component({
  selector: "app-create-pet",
  standalone: false,
  templateUrl: "./create-pet.html",
  styleUrls: ["./create-pet.scss"]
})
export class CreatePetComponent {
  nombre = "";
  raza = ""
  tamano = "";
  genero = "";
  edad: number | null = null;
  archivoVacunas: File | null = null;
  imagen: File | null = null;
  estado_salud = "saludable";
  enviando = false;
  modalVisible = false;
  modalTitulo = '';
  modalMensaje = '';
  modalTipo: 'success' | 'error' = 'success';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  submit() {
    console.log("Submit mascota ejecutado")
    const nombre = this.nombre.trim();
    const raza = this.raza.trim();
    const tamano = this.tamano.trim();
    const genero = this.genero.trim();
    const edad = this.edad;
    const archivoVacunas = this.archivoVacunas;
    const imagen = this.imagen;
    const estado_salud = this.estado_salud;
    if(!nombre) {
      this.mostrarModal('Error de validación', 'El nombre es obligatorio', 'error');
      return;
    }
    if(!raza) {
      this.mostrarModal('Error de validación', 'La raza es obligatoria', 'error');
      return;
    }
    if(!tamano) {
      this.mostrarModal('Error de validación', 'El tamaño es obligatorio', 'error');
      return;
    }
    if(!genero) {
      this.mostrarModal('Error de validación', 'El género es obligatorio', 'error');
      return;
    }
    if(edad === null || isNaN(edad)) {
      this.mostrarModal('Error de validación', 'La edad es obligatoria y debe ser un número válido', 'error');
      return;
    }

    const body: CreatePetRequest = {
      nombre: nombre,
      raza: raza,
      tamano: tamano,
      genero: genero,
      edad: edad,
      estado_salud: "saludable",
      vacuna_imagen_url: "",
      //imagen: imagen
      id_usuario: localStorage.getItem("id_usuario") ? Number(localStorage.getItem("id_usuario")) : null
    };

    this.enviando = true;

    this.http.post('http://localhost:3000/pets', body).subscribe({
      next: () => {
        this.limpiarFormulario();
        this.enviando = false;
        this.mostrarModal('Éxito', 'La mascota ha sido creada exitosamente', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear la mascota:', error);
        const mensaje= error?.error?.message || 'Hubo un error al crear la mascota. Por favor, inténtalo de nuevo.';
        this.enviando = false;
        this.mostrarModal('Error', Array.isArray(mensaje)?mensaje.join('\n'): mensaje, 'error');
        this.cdr.detectChanges();
      },
    });

  }
  onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.imagen = input.files[0];
  }
}

onVaccineSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.archivoVacunas = input.files[0];
  }
}
  private limpiarFormulario() {
    this.nombre = '';
    this.raza = '';
    this.tamano = '';
    this.genero = '';
    this.edad = null;
    this.archivoVacunas = null;
    this.imagen = null;
  }
  mostrarModal(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalTipo = tipo;
    this.modalVisible = true;
  }
  cerrarModal(): void {
    this.modalVisible = false;
    if(this.modalTipo === 'success') {
      this.router.navigate(['/dashboard-owner']);
    }
  }
}

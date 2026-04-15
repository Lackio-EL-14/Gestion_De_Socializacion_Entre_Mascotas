import { ChangeDetectorRef, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { AlertModalComponent } from "../../../shared/components/alert-modal/alert-modal.component";
import { BackButtonComponent } from "../../../shared/components/back-button/back-button.component";
import { TranslateModule } from '@ngx-translate/core';

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
  standalone: true, // Arquitectura Standalone
  imports: [CommonModule, FormsModule, RouterModule, AlertModalComponent, BackButtonComponent, TranslateModule], // Inyecciones necesarias
  templateUrl: "./create-pet.component.html",
  styleUrls: ["./create-pet.component.scss"]
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
      this.mostrarModal('Error de validación', "{{'pets.create.validation.nameRequired' | translate}}", 'error');
      return;
    }
    if(!raza) {
      this.mostrarModal('Error de validación', "{{'pets.create.validation.breedRequired' | translate}}", 'error');
      return;
    }
    if(!tamano) {
      this.mostrarModal('Error de validación', "{{'pets.create.validation.sizeRequired' | translate}}", 'error');
      return;
    }
    if(!genero) {
      this.mostrarModal('Error de validación', "{{'pets.create.validation.genderRequired' | translate}}", 'error');
      return;
    }
    if(edad === null || isNaN(edad)) {
      this.mostrarModal('Error de validación', "{{'pets.create.validation.ageRequired' | translate}}", 'error');
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
        this.mostrarModal("{{'pets.create.modal.successTitle' | translate}}", "{{'pets.create.modal.successMessage' | translate}}", 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear la mascota:', error);
        const mensaje= error?.error?.message || "{{'pets.create.modal.errorMessage' | translate}}";
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

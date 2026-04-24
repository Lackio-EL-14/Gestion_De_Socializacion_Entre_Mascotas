import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';

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
    private cdr: ChangeDetectorRef,
    private readonly translate: TranslateService
  ) {}

  submit() {  
    if (this.enviando) {
      return;
    }

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
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.nameRequired', 'error');
      return;
    }
    if(!raza) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.breedRequired', 'error');
      return;
    }
    if(!tamano) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.sizeRequired', 'error');
      return;
    }
    if(!genero) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.genderRequired', 'error');
      return;
    }
    if(edad === null || Number.isNaN(edad)) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.ageRequired', 'error');
      return;
    }

    if (!Number.isInteger(edad) || edad < 1 || edad > 30) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.ageOutOfRange', 'error');
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
        this.mostrarModalByKey('pets.create.modal.successTitle', 'pets.create.modal.successMessage', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al crear la mascota:', error);
        const mensaje= error?.error?.message || this.t('pets.create.modal.errorMessage');
        this.enviando = false;
        this.mostrarModal(this.t('pets.common.errorTitle'), Array.isArray(mensaje)?mensaje.join('\n'): mensaje, 'error');
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

  private t(key: string): string {
    return this.translate.instant(key);
  }

  private mostrarModalByKey(titleKey: string, messageKey: string, tipo: 'success' | 'error'): void {
    this.mostrarModal(this.t(titleKey), this.t(messageKey), tipo);
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

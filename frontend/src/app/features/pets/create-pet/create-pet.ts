import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from "rxjs";

interface CreatePetRequest {
  nombre: string;
  raza: string;
  tamano: string;
  genero: string;
  edad: number;
  estado_salud: string;
  vacuna_imagen_url: string;
  perfil_imagen_url: string;
  id_usuario: number | null;
}
@Component({
  selector: "app-create-pet",
  standalone: false,
  templateUrl: "./create-pet.html",
  styleUrls: ["./create-pet.scss"]
})
export class CreatePetComponent {
  readonly razasDisponibles: { value: string; label: string }[] = [
    { value: 'golden_retriever', label: 'Golden Retriever' },
    { value: 'labrador', label: 'Labrador' },
    { value: 'bulldog', label: 'Bulldog' },
    { value: 'poodle', label: 'Poodle' },
    { value: 'beagle', label: 'Beagle' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'pastor_aleman', label: 'Pastor Aleman' },
    { value: 'husky', label: 'Husky Siberiano' },
    { value: 'shih_tzu', label: 'Shih Tzu' },
    { value: 'dalmata', label: 'Dalmata' },
    { value: 'otra', label: 'Otras' },
  ];

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

  async submit() {
    if (this.enviando) {
      return;
    }

    console.log("Submit mascota ejecutado")
    const nombre = this.nombre.trim();
    const raza = this.raza.trim();
    const tamano = this.tamano.trim();
    const genero = this.genero.trim();
    const edad = this.edad;
    const estado_salud = this.estado_salud;
    if(!nombre) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.nameRequired', 'error');
      return;
    }
    if(!raza) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.breedRequired', 'error');
      return;
    }

    const razasPermitidas = this.razasDisponibles.map((razaItem) => razaItem.value);
    if (!razasPermitidas.includes(raza)) {
      this.mostrarModalByKey('pets.common.validationTitle', 'pets.create.validation.breedInvalid', 'error');
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

    try {
      // 1. Preparar Headers con el Token para el endpoint de Upload
      const token = localStorage.getItem("access_token");
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      let urlImagenPerro = "";
      let urlImagenVacuna = "";

      // 2. Subir imagen del perrito (si el usuario la seleccionó)
      if (this.imagen) {
        const formData = new FormData();
        // IMPORTANTE: Asegúrate de que 'file' sea el nombre de campo que espera tu endpoint /upload en NestJS
        formData.append('file', this.imagen);

        const uploadRes: any = await firstValueFrom(
          this.http.post('https://gestion-de-socializacion-entre-mascotas.onrender.com/upload', formData, { headers })
        );
        urlImagenPerro = uploadRes.url;
      }

      // 3. Subir imagen de vacuna (si el usuario la seleccionó)
      if (this.archivoVacunas) {
        const formData = new FormData();
        formData.append('file', this.archivoVacunas);

        const uploadRes: any = await firstValueFrom(
          this.http.post('https://gestion-de-socializacion-entre-mascotas.onrender.com/upload', formData, { headers })
        );
        urlImagenVacuna = uploadRes.url;
      }

      // 4. Armar el cuerpo de la petición final para Crear el Perrito
      const body: CreatePetRequest = {
        nombre: nombre,
        raza: raza,
        tamano: tamano,
        genero: genero,
        edad: edad!,
        estado_salud: estado_salud,
        vacuna_imagen_url: urlImagenVacuna, // URL final obtenida
        perfil_imagen_url: urlImagenPerro,         // URL final obtenida
        id_usuario: localStorage.getItem("id_usuario") ? Number(localStorage.getItem("id_usuario")) : null
      };

    this.enviando = true;

    const petResponse = await firstValueFrom(
        this.http.post('https://gestion-de-socializacion-entre-mascotas.onrender.com/pets', body)
      );

    this.limpiarFormulario();
      this.enviando = false;
      this.mostrarModalByKey('pets.create.modal.successTitle', 'pets.create.modal.successMessage', 'success');
      this.cdr.detectChanges();

    } catch (error: any) {
      // Captura de errores tanto de la subida de imágenes como de la creación de la mascota
      console.error('Error en el proceso:', error);
      const mensaje = error?.error?.message || 'Error al procesar la solicitud o subir los archivos.';

      this.enviando = false;
      this.mostrarModal(
        this.t('pets.common.errorTitle'),
        Array.isArray(mensaje) ? mensaje.join('\n') : mensaje,
        'error'
      );
      this.cdr.detectChanges();
    }

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
      this.router.navigate(['/pets/list-pets']);
    }
  }
}

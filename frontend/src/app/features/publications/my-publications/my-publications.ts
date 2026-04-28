import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

// Interfaz para estructurar lo que nos devuelve la apiMAGICA
export interface Publication {
  id: number;
  imageUrl: string;
  title: string;
  date: string;
  status: 'Publicado' | 'Pendiente' | 'Rechazado';
}

@Component({
  selector: 'app-my-publications',
  standalone: false,
  templateUrl: './my-publications.html',
  styleUrl: './my-publications.scss'
})
export class MyPublicationsComponent implements OnInit {
  publications: Publication[] = [];
  cargando: boolean = true;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.obtenerPublicaciones();
  }

  obtenerPublicaciones(): void {
    this.http.get<Publication[]>('http://localhost:3000/publications/me').subscribe({
      next: (data) => {
        this.publications = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener tus publicaciones', error);
        this.cargando = false;
      }
    });
  }
}

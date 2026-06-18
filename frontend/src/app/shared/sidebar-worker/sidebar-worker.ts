import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-worker',
  standalone: false,
  templateUrl: './sidebar-worker.html',
  styleUrl: './sidebar-worker.scss',
})
export class SidebarWorker {
  constructor(private readonly router: Router) {}

  cerrarSesion(): void {
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioEmail');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('id_rol');
    localStorage.removeItem('access_token');

    // Limpia posibles valores antiguos.
    sessionStorage.removeItem('usuarioNombre');
    sessionStorage.removeItem('usuarioEmail');

    this.router.navigate(['/login']);
  }
}
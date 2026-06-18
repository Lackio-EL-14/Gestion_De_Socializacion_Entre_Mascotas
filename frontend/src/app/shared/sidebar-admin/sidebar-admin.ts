import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  standalone: false,
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.scss'
})
export class SidebarAdminComponent {
  mobileOpen = false;

  constructor(private readonly router: Router) {}

  toggleMobileSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileSidebar(): void {
    this.mobileOpen = false;
  }

  cerrarSesion(): void {
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioEmail');
    localStorage.removeItem('id_usuario');
    localStorage.removeItem('id_rol');
    localStorage.removeItem('access_token');

    // Elimina posibles datos antiguos.
    sessionStorage.removeItem('usuarioNombre');
    sessionStorage.removeItem('usuarioEmail');

    this.mobileOpen = false;
    this.router.navigate(['/login']);
  }
}
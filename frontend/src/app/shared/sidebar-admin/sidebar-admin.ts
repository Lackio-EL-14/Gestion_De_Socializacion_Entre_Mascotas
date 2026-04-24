import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin',
  standalone: false,
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.scss'
})
export class SidebarAdminComponent {
  mobileOpen = false;

  toggleMobileSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileSidebar(): void {
    this.mobileOpen = false;
  }
}

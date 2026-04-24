import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-owner',
  standalone: false,
  templateUrl: './sidebar-owner.html',
  styleUrl: './sidebar-owner.scss'
})
export class SidebarOwnerComponent {
  mobileOpen = false;

  toggleMobileSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeMobileSidebar(): void {
    this.mobileOpen = false;
  }
}
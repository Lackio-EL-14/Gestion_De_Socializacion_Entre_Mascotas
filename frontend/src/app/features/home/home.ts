import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  constructor(private router: Router) {}

  irARegistroDueno(): void {
    this.router.navigate(['/register']);
  }

  irARegistroTrabajador(): void {
    this.router.navigate(['/register-trabajador']);
  }
}
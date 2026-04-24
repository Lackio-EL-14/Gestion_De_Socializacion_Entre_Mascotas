import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-worker',
  standalone: false,
  templateUrl: './dashboard-worker.html',
  styleUrl: './dashboard-worker.scss'
})
export class DashboardWorkerComponent {
  // Simulamos obtener el nombre del negocio de la sesión
  nombreNegocio = sessionStorage.getItem('businessName') || 'Mi Peluquería Canina';

  constructor(private readonly translate: TranslateService) {}
}

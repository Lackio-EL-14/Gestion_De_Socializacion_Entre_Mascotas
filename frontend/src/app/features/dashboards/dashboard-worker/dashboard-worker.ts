import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-worker',
  standalone: false,
  templateUrl: './dashboard-worker.html',
  styleUrl: './dashboard-worker.scss'
})
export class DashboardWorkerComponent {
  nombreNegocio = sessionStorage.getItem('usuarioNombre') || 'Mi Peluquería Canina';

  constructor(private readonly translate: TranslateService) {}
}

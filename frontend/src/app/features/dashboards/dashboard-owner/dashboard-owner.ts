import { Component } from '@angular/core';

@Component({
	selector: 'app-dashboard-owner',
	standalone: false,
	templateUrl: './dashboard-owner.html',
	styleUrl: './dashboard-owner.scss'
})
export class DashboardOwner {
	nombreUsuario = sessionStorage.getItem('usuarioNombre') || 'Usuario';
}

import { Component } from '@angular/core';

@Component({
	selector: 'app-dashboard-edit-owner',
	standalone: false,
	templateUrl: './dashboard-edit-owner.html',
	styleUrl: './dashboard-edit-owner.scss'
})
export class DashboardEditOwner {
	nombreUsuario = sessionStorage.getItem('usuarioNombre') || 'Usuario';
	emailUsuario = sessionStorage.getItem('usuarioEmail') || 'correo@no-disponible.com';
}

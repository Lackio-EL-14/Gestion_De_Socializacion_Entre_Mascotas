import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-dashboard-owner',
	standalone: false,
	templateUrl: './dashboard-owner.html',
	styleUrl: './dashboard-owner.scss'
})
export class DashboardOwner {
	nombreUsuario = sessionStorage.getItem('usuarioNombre') || 'Usuario';

	constructor(private readonly translate: TranslateService) {}

	private t(key: string): string {
		return this.translate.instant(key);
	}
}

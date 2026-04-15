import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-role-card',
  standalone: true,
  imports: [CommonModule, TranslateModule], // Agrega TranslateModule si usas traducciones
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss']
})
export class RoleCardComponent {
  @Input() roleType: 'owner' | 'worker' = 'owner';
  @Input() title: string = '';
  @Input() description: string = '';
}

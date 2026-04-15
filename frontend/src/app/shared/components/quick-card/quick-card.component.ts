import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-quick-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule], // Agrega TranslateModule si usas traducciones
  templateUrl: './quick-card.component.html',
  styleUrls: ['./quick-card.component.scss']
})
export class QuickCardComponent {
  @Input() route!: string;
  @Input() iconClass!: string;
  @Input() titulo!: string;
  @Input() descripcion!: string;
}

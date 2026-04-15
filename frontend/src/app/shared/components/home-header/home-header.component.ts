import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrandLogoComponent } from '../brand-logo/brand-logo.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-header',
  standalone: true,
  imports: [RouterModule, BrandLogoComponent, TranslateModule],
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent {}

import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-admin',
  standalone: false,
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.scss'
})
export class DashboardAdmin {

  constructor(private readonly translate: TranslateService) {}

  private t(key: string): string {
    return this.translate.instant(key);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing-module';
import { CreateReportComponent } from './create-report/create-report';

@NgModule({
  declarations: [CreateReportComponent],
  imports: [CommonModule, ReportsRoutingModule, FormsModule],
})
export class ReportsModule {}

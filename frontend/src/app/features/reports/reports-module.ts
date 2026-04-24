import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ReportsRoutingModule } from './reports-routing-module';
import { CreateReportComponent } from './create-report/create-report';
import { ReportsPanelComponent } from './reports-panel/reports-panel';
import { AnswerReportComponent } from './answer-report/answer-report';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [CreateReportComponent, ReportsPanelComponent, AnswerReportComponent],
  imports: [CommonModule, ReportsRoutingModule, FormsModule, TranslateModule, SharedModule],
})
export class ReportsModule {}

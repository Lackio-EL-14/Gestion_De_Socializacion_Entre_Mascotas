import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReportComponent } from './create-report/create-report';
import { ReportsPanelComponent } from './reports-panel/reports-panel';  
import { AnswerReportComponent } from './answer-report/answer-report';

const routes: Routes = [
  { path: 'create-report', component: CreateReportComponent },
  { path: 'admin/reports/answer/:id', component: AnswerReportComponent },
  { path: '', component: ReportsPanelComponent } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

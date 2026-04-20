import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateReportComponent } from './create-report/create-report';

const routes: Routes = [
  { path: 'create-report', component: CreateReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

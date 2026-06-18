import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecommendationsViewComponent } from './recommendations-view/recommendations-view';

const routes: Routes = [
  { path: '', component: RecommendationsViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecommendationsRoutingModule {}

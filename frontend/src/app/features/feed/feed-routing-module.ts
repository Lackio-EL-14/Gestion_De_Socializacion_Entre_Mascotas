import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedHome } from './feed-home/feed-home';
import { Filtros } from './feed-filtros/filtros';

const routes: Routes = [
  { path: '', component: FeedHome },
  { path: 'filtros', component: Filtros },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRoutingModule {}

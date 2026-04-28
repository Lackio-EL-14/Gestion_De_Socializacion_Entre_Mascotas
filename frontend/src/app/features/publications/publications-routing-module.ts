import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeePublications } from './watch-publication/see-publications';
import { CreatePublications } from './create-publication/create.publications';

const routes: Routes = [
  { path: '', component: SeePublications },
  { path: 'create-publication', component: CreatePublications },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicationsRoutingModule {}

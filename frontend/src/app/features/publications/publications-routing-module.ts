import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SeePublications } from './watch-publication/see-publications';
import { CreatePublications } from './create-publication/create.publications';
import { SeePublicationsOwner } from './watch-publication-owner/see-publications-owner';
import { MyPublicationsComponent } from './my-publications/my-publications';

const routes: Routes = [
  { path: 'worker', component: SeePublications },
  { path: 'owner', component: SeePublicationsOwner },
  { path: 'my-publications', component: MyPublicationsComponent },
  { path: 'create-publication', component: CreatePublications },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicationsRoutingModule {}

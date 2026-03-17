import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePetComponent } from './create-pet/create-pet';

const routes: Routes = [
  {path: 'create-pet', component: CreatePetComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsRoutingModule {}

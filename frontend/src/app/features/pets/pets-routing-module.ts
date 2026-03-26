import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePetComponent } from './create-pet/create-pet';
import { ListPetsComponent } from './list-pets/list-pets';

const routes: Routes = [
  {path: 'create-pet', component: CreatePetComponent},
  {path: 'list-pets', component: ListPetsComponent} 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PetsRoutingModule {}

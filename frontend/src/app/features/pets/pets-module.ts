import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PetsRoutingModule } from './pets-routing-module';
import { CreatePetComponent } from './create-pet/create-pet';
import { ListPetsComponent } from './list-pets/list-pets';
import { EditPetComponent } from './edit-pet/edit-pet';

@NgModule({
  declarations: [CreatePetComponent, ListPetsComponent, EditPetComponent],
  imports: [CommonModule, PetsRoutingModule, FormsModule],
})
export class PetsModule {}

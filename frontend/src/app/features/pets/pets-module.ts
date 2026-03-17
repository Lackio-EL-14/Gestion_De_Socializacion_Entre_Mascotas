import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PetsRoutingModule } from './pets-routing-module';
import { CreatePetComponent } from './create-pet/create-pet';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreatePetComponent],
  imports: [CommonModule, PetsRoutingModule, FormsModule],
})
export class PetsModule {}

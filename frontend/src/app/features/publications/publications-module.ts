import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PublicationsRoutingModule } from './publications-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { SeePublications } from './watch-publication/see-publications';
import { CreatePublications } from './create-publication/create.publications';

@NgModule({
  declarations: [SeePublications, CreatePublications],
  imports: [CommonModule, PublicationsRoutingModule, SharedModule, TranslateModule],
})
export class PublicationsModule {}

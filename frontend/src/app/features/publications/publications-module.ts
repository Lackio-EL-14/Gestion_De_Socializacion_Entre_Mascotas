import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PublicationsRoutingModule } from './publications-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { SeePublications } from './watch-publication/see-publications';
import { CreatePublications } from './create-publication/create.publications';
import { MyPublicationsComponent } from './my-publications/my-publications';
import { SeePublicationsOwner } from './watch-publication-owner/see-publications-owner';

@NgModule({
  declarations: [SeePublications, CreatePublications, MyPublicationsComponent, SeePublicationsOwner],
  imports: [CommonModule, PublicationsRoutingModule, SharedModule, TranslateModule],
})
export class PublicationsModule {}

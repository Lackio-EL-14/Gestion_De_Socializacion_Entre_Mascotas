import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FeedRoutingModule } from './feed-routing-module';
import { FeedHome } from './feed-home/feed-home';
import { Filtros } from './feed-filtros/filtros';
import { SharedModule } from '../../shared/shared-module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedHome, Filtros],
  imports: [CommonModule, FeedRoutingModule, TranslateModule, SharedModule, FormsModule],
})
export class FeedModule {}
  
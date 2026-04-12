import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { FeedRoutingModule } from './feed-routing-module';
import { FeedHome } from './feed-home/feed-home';

@NgModule({
  declarations: [FeedHome],
  imports: [CommonModule, FeedRoutingModule, TranslateModule],
})
export class FeedModule {}
  
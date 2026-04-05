import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedRoutingModule } from './feed-routing-module';
import { FeedHome } from './feed-home/feed-home';

@NgModule({
  declarations: [FeedHome],
  imports: [CommonModule, FeedRoutingModule],
})
export class FeedModule {}
  
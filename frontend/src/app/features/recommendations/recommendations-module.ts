import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../shared/shared-module';
import { RecommendationsRoutingModule } from './recommendations-routing-module';
import { RecommendationsViewComponent } from './recommendations-view/recommendations-view';

@NgModule({
  declarations: [RecommendationsViewComponent],
  imports: [CommonModule, TranslateModule, SharedModule, RecommendationsRoutingModule],
})
export class RecommendationsModule {}

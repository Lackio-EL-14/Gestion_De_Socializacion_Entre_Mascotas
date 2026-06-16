import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { EventsRoutingModule } from './events-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { EventsCatalogComponent } from './events-catalog/events-catalog';
import { EventManageFormComponent } from './event-manage-form/event-manage-form';

@NgModule({
  declarations: [EventsCatalogComponent, EventManageFormComponent],
  imports: [CommonModule, FormsModule, TranslateModule, SharedModule, EventsRoutingModule],
})
export class EventsModule {}

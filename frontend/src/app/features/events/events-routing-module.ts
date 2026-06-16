import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

import { EventsCatalogComponent } from './events-catalog/events-catalog';
import { EventManageFormComponent } from './event-manage-form/event-manage-form';

const routes: Routes = [
  { path: '', component: EventsCatalogComponent },
  {
    path: 'create',
    component: EventManageFormComponent,
    canActivate: [roleGuard],
    data: { roles: [1, 2, 3] }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventsRoutingModule {}

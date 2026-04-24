import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarOwnerComponent } from './sidebar-owner/sidebar-owner';
import { SidebarAdminComponent } from './sidebar-admin/sidebar-admin';
import { SidebarWorker } from './sidebar-worker/sidebar-worker';

@NgModule({
  declarations: [SidebarOwnerComponent, SidebarAdminComponent, SidebarWorker],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [SidebarOwnerComponent, SidebarAdminComponent, SidebarWorker],
})
export class SharedModule {}

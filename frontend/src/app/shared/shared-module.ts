import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarOwnerComponent } from './sidebar-owner/sidebar-owner';

@NgModule({
  declarations: [SidebarOwnerComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [SidebarOwnerComponent]
})
export class SharedModule {}
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './features/home/home';
import { DashboardOwner } from './features/dashboards/dashboard-owner/dashboard-owner';
import { DashboardEditOwner } from './features/dashboards/dashboard-edit_owner/dashboard-edit-owner';

@NgModule({
  declarations: [App, Home, DashboardOwner, DashboardEditOwner],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}

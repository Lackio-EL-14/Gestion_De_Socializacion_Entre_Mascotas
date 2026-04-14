import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { DashboardOwner } from './features/dashboards/dashboard-owner/dashboard-owner';
import { DashboardEditOwner } from './features/dashboards/dashboard-edit_owner/dashboard-edit-owner';
import { DashboardAdmin } from './features/dashboards/dashboard-admin/dashboard-admin';

const routes: Routes = [
  { path: 'dashboard-owner', component: DashboardOwner },
  { path: 'dashboard-admin', component: DashboardAdmin },
  { path: 'dashboard-edit-owner', component: DashboardEditOwner },
  {
    path: 'pets',
    loadChildren: () =>
      import('./features/pets/pets-module').then(m => m.PetsModule)
  },
  {
    path: 'feed',
    loadChildren: () =>
      import('./features/feed/feed-module').then(m => m.FeedModule)
  },
  {
    path: '',
    pathMatch: 'full',
    component: Home,
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./features/reports/reports-module').then(m => m.ReportsModule)
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./features/users/users-module').then(m => m.UsersModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
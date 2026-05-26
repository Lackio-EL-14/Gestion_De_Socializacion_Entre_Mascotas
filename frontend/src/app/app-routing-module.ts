import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { DashboardOwner } from './features/dashboards/dashboard-owner/dashboard-owner';
import { DashboardEditOwner } from './features/dashboards/dashboard-edit_owner/dashboard-edit-owner';
import { DashboardAdmin } from './features/dashboards/dashboard-admin/dashboard-admin';
import { DashboardWorkerComponent } from './features/dashboards/dashboard-worker/dashboard-worker';
import { AdminContentPublicationsComponent } from './features/dashboards/dashboard-admin/content-management/content-management';
import { roleGuard } from './core/guards/role.guard';

const routes: Routes = [
  /*{ path: 'dashboard-worker', component: DashboardWorkerComponent },
  { path: 'dashboard-owner', component: DashboardOwner },
  { path: 'dashboard-admin', component: DashboardAdmin },
  { path: 'admin/content', component: AdminContentPublicationsComponent },
  { path: 'dashboard-edit-owner', component: DashboardEditOwner },*/
  {
    path: 'dashboard-worker',
    component: DashboardWorkerComponent,
    canActivate: [roleGuard],
    data: { roles: [3] }
  },
  {
    path: 'dashboard-owner',
    component: DashboardOwner,
    canActivate: [roleGuard],
    data: { roles: [1] }
  },
  {
    path: 'dashboard-admin',
    component: DashboardAdmin,
    canActivate: [roleGuard],
    data: { roles: [2] }
  },
  {
    path: 'admin/content',
    component: AdminContentPublicationsComponent,
    canActivate: [roleGuard],
    data: { roles: [2] }
  },
  {
    path: 'dashboard-edit-owner',
    component: DashboardEditOwner,
    canActivate: [roleGuard],
    data: { roles: [1] }
  },
  {
    path: 'publications',
    loadChildren: () =>
      import('./features/publications/publications-module').then(m => m.PublicationsModule)
  },
  {
    path: 'worker/publications',
    loadChildren: () =>
      import('./features/publications/publications-module').then(m => m.PublicationsModule),
    canActivate: [roleGuard],
    data: { roles: [3] }
  },
  {
    path: 'worker/my-publications',
    loadChildren: () =>
      import('./features/publications/publications-module').then(m => m.PublicationsModule),
    canActivate: [roleGuard],
    data: { roles: [3] }
  },
  {
    path: 'pets',
    loadChildren: () =>
      import('./features/pets/pets-module').then(m => m.PetsModule)
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./features/chat/chat-module').then(m => m.ChatModule),
    canActivate: [roleGuard],
    data: { roles: [1, 3] }
  },
  {
    path: 'chats',
    redirectTo: 'chat',
    pathMatch: 'full'
  },
  {
    path: 'worker/chats',
    redirectTo: 'chat',
    pathMatch: 'full'
  },
  {
    path: 'owner/chats',
    redirectTo: 'chat',
    pathMatch: 'full'
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
    path: 'admin/reports',
    loadChildren: () =>
      import('./features/reports/reports-module').then(m => m.ReportsModule),
    canActivate: [roleGuard],
    data: { roles: [2] }
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

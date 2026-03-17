import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { DashboardOwner } from './features/dashboards/dashboard-owner/dashboard-owner';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'dashboard-owner', component: DashboardOwner },
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  {
    path: 'pets',
    loadChildren: () =>
      import('./features/pets/pets-module').then(m => m.PetsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

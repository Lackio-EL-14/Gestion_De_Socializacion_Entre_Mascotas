import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListUsersComponent } from './list-users/list-users';
import { PublicProfileUserComponent } from './public-profile-user/public-profile-user';
import { ListUsersWorkerComponent } from './list-users-worker/list-users-worker';

const routes: Routes = [
  { path: '', component: ListUsersComponent },
  { path: 'worker', component: ListUsersWorkerComponent },
  { path: 'profile/:id', component: PublicProfileUserComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsersRoutingModule } from './users-routing-module';
import { SharedModule } from '../../shared/shared-module';
import { ListUsersComponent } from './list-users/list-users';
import { PublicProfileUserComponent } from './public-profile-user/public-profile-user';
import { TranslateModule } from '@ngx-translate/core';
import { ListUsersWorkerComponent } from './list-users-worker/list-users-worker';

@NgModule({
  declarations: [ListUsersComponent, PublicProfileUserComponent, ListUsersWorkerComponent],
  imports: [CommonModule, UsersRoutingModule, FormsModule, SharedModule, TranslateModule],
})
export class UsersModule {}

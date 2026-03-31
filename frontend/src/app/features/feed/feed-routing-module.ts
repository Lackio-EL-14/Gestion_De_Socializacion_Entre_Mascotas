import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedHome } from './feed-home/feed-home';

const routes: Routes = [{ path: '', component: FeedHome }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TVShowCastComponent } from './pages/tv-show-cast/tv-show-cast.component';
import { TvShowDetailComponent } from './pages/tv-show-detail/tv-show-detail.component';
import { TvShowsComponent } from './pages/tv-shows/tv-shows.component';
import { TVShowReviewComponent } from './pages/tv-show-review/tv-show-review.component';

const routes: Routes = [
  {
    path: '',
    component: TvShowsComponent,
  },
  {
    path: 'details/:id',
    component: TvShowDetailComponent,
  },
  {
    path: 'details/:id/casts',
    component: TVShowCastComponent,
    pathMatch: 'full',
  },
  {
    path: 'details/:id/reviews',
    component: TVShowReviewComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TvShowsRoutingModule {}

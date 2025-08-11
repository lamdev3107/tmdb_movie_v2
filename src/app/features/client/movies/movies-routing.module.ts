import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoviesComponent } from './pages/movies/movies.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { MovieCastComponent } from './pages/movie-cast/movie-cast.component';
import { MovieReviewComponent } from './pages/movie-review/movie-review.component';

// Cấu hình routes giữ nguyên như sau:
const routes: Routes = [
  {
    path: '',
    component: MoviesComponent,
  },
  {
    path: 'details/:id',
    component: MovieDetailsComponent,
  },
  {
    path: 'details/:id/casts',
    component: MovieCastComponent,
    pathMatch: 'full',
  },
  {
    path: 'details/:id/reviews',
    component: MovieReviewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}

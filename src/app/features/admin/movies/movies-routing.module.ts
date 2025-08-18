import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListMovieComponent } from './pages/list-movie/list-movie.component';
import { CreateMovieComponent } from './pages/create-movie/create-movie.component';
import { EditMovieComponent } from './pages/edit-movie/edit-movie.component';

const routes: Routes = [
  {
    path: '',
    component: ListMovieComponent,
  },
  {
    path: 'create',
    component: CreateMovieComponent,
  },
  {
    path: 'edit/:id',
    component: EditMovieComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}

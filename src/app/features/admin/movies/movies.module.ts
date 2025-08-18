import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MoviesRoutingModule } from './movies-routing.module';
import { ListMovieComponent } from './pages/list-movie/list-movie.component';
import { MovieFormComponent } from './pages/movie-form/movie-form.component';
import { CreateMovieComponent } from './pages/create-movie/create-movie.component';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { EditMovieComponent } from './pages/edit-movie/edit-movie.component';

@NgModule({
  declarations: [
    ListMovieComponent,
    CreateMovieComponent,
    MovieFormComponent,
    EditMovieComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    MoviesRoutingModule,
  ],
})
export class MoviesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GenresRoutingModule } from './genres-routing.module';
import { GenreListComponent } from './pages/genre-list/genre-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [GenreListComponent],
  imports: [
    CommonModule,
    GenresRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
  ],
})
export class GenresModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MoviesRoutingModule } from './movies-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { pages } from './pages';
import { SwiperModule } from 'swiper/angular';
import { components } from './components';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [...pages, ...components],
  imports: [
    CommonModule,
    FormsModule,
    MoviesRoutingModule,
    HttpClientModule,
    SharedModule,
    SwiperModule,
  ],
})
export class MoviesModule {}

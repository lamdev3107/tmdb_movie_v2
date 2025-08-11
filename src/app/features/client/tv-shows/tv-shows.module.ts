import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TvShowsRoutingModule } from './tv-shows-routing.module';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/shared/shared.module';

import { pages } from './pages';
import { components } from './components';

@NgModule({
  declarations: [...components, ...pages],
  imports: [
    CommonModule,
    FormsModule,
    TvShowsRoutingModule,
    SwiperModule,
    SharedModule,
  ],
  exports: [...components, ...pages],
})
export class TvShowsModule {}

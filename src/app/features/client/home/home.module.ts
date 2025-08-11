import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { components } from './components';
import { pages } from './pages';

@NgModule({
  declarations: [...components, ...pages],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    HttpClientModule,
    SwiperModule,
  ],
  exports: [],
})
export class HomeModule {}

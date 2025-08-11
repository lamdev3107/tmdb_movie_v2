import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';
import { components } from './components';
import { pipes } from './pipes';

@NgModule({
  declarations: [...components, ...pipes],
  imports: [
    CommonModule,
    FormsModule,
    SwiperModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [...components, ...pipes],
})
export class SharedModule {}

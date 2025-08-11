import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { pages } from './pages';
import { components } from './components';

@NgModule({
  declarations: [...pages, ...components],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
  ],
})
export class AccountModule {}

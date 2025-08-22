import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { pages } from './pages';
import { components } from './components';
import { RatingComponent } from './pages/rating/rating.component';
import { WatchlistDetailComponent } from './pages/watchlist-detail/watchlist-detail.component';
import { ListFormModalComponent } from './components/list-form-modal/list-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ...pages,
    ...components,
    RatingComponent,
    WatchlistDetailComponent,
    ListFormModalComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    HttpClientModule,
  ],
})
export class AccountModule {}

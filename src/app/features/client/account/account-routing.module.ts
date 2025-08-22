import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';
import { RatingComponent } from './pages/rating/rating.component';
import { WatchlistDetailComponent } from './pages/watchlist-detail/watchlist-detail.component';

const routes: Routes = [
  {
    path: '',
    component: AccountLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'favorite' },
      {
        path: 'watchlist',
        component: WatchlistComponent,
      },
      {
        path: 'watchlist/:id',
        component: WatchlistDetailComponent,
      },
      {
        path: 'favorite',
        component: FavoriteComponent,
      },
      {
        path: 'rating',
        component: RatingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}

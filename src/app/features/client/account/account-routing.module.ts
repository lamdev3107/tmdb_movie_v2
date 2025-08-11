import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchlistComponent } from './pages/watchlist/watchlist.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { AccountLayoutComponent } from './components/account-layout/account-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AccountLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'watchlist' },
      {
        path: 'watchlist',
        component: WatchlistComponent,
      },
      {
        path: 'favorite',
        component: FavoriteComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AccountService } from '@core/services/account.service';
import { TabItem } from '@shared/components/tab/tab.component';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  // Favorite sub-tabs
  favoriteSubTabs: TabItem[] = [
    { id: 'movies', label: 'Movies ' },
    { id: 'tv', label: 'TV ' },
  ];

  favoriteMovies$ = this.accountService.getFavoriteMovies();
  favoriteTv$ = this.accountService.getFavoriteTV();

  activeFavoriteTab: string = 'movies';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  handleRemoveFromFavorite() {
    this.favoriteMovies$ = this.accountService.getFavoriteMovies();
    this.favoriteTv$ = this.accountService.getFavoriteTV();
  }
  onFavoriteTabChange(tabId: string): void {
    this.activeFavoriteTab = tabId;
  }
}

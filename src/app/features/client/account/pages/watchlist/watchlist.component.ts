import { Component, OnInit } from '@angular/core';
import { AccountService } from '@core/services/account.service';
import { TabItem } from '@shared/components/tab/tab.component';
import { ChangeDetectorRef } from '@angular/core'; // Thêm dòng này ở đầu file

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
  // Watchlist sub-tabs
  watchlistSubTabs: TabItem[] = [
    { id: 'movies', label: 'Movies ' },
    { id: 'tv', label: 'TV ' },
  ];
  watchlistMovies$ = this.accountService.getWatchlistMovies();
  watchlistTv$ = this.accountService.getWatchlistTV();

  activeWatchlistTab: string = 'movies';

  constructor(
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  handleRemoveFromWatchlist() {
    this.watchlistMovies$ = this.accountService.getWatchlistMovies();
    this.watchlistTv$ = this.accountService.getWatchlistTV();
  }
  onWatchlistTabChange(tabId: string): void {
    this.activeWatchlistTab = tabId;
  }
}

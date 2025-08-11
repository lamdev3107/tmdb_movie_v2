import { ActivatedRoute } from '@angular/router';
import { AccountStates } from './../../../core/models/account.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '@core/services/account.service';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { ToastService } from '@core/services/toast.service';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';
import { MovieService } from '@features/client/movies/services/movie.service';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.scss'],
})
export class WatchlistCardComponent implements OnInit {
  @Input() mediaType: 'movie' | 'tv' = 'movie';
  @Input() data: any;

  @Output() removeFromList = new EventEmitter<any>();
  accountStates: AccountStates | null = null;
  constructor(
    private movieService: MovieService,
    private tvShowService: TVShowService,
    private accountService: AccountService,
    private toastService: ToastService,
    private route: ActivatedRoute
  ) {}
  currentRoute: string = 'watchlist';
  // Lấy ra watchlist trên url
  isWatchlistPage: boolean = false;

  ngOnInit(): void {
    this.loadAccountStatus();
    this.route.url.subscribe((segments) => {
      if (segments.length > 0) {
        const currentRoute = segments[0].path;
        this.currentRoute = currentRoute;
      }
    });
    // Kiểm tra nếu url chứa '/account/watchlist'
  }

  loadAccountStatus() {
    if (this.mediaType === 'movie') {
      this.movieService
        .getMovieAccountStates(Number(this.data.id))
        .subscribe((res) => {
          this.accountStates = res;
        });
    } else {
      this.tvShowService
        .getTVShowAccountStates(Number(this.data.id))
        .subscribe((res) => {
          this.accountStates = res;
        });
    }
  }
  handleToggleFavorite() {
    if (this.mediaType === 'movie') {
      this.accountService
        .markAsFavorite(
          'movie',
          Number(this.data.id),
          !this.accountStates?.favorite
        )
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.favorite = !this.accountStates.favorite;
          }
        });
    } else {
      this.accountService
        .markAsFavorite(
          'tv',
          Number(this.data.id),
          !this.accountStates?.favorite
        )
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.favorite = !this.accountStates.favorite;
          }
        });
    }
  }
  handleToggleWatchlist() {
    if (this.mediaType === 'movie') {
      this.accountService
        .addToWatchlist(
          'movie',
          Number(this.data.id),
          !this.accountStates?.watchlist
        )
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.watchlist = !this.accountStates.watchlist;
          }
        });
    } else {
      this.accountService
        .addToWatchlist(
          'tv',
          Number(this.data.id),
          !this.accountStates?.watchlist
        )
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.watchlist = !this.accountStates.watchlist;
          }
        });
    }
  }

  handleRemoveFromlist() {
    if (this.currentRoute === 'watchlist') {
      if (this.mediaType === 'movie') {
        this.accountService
          .addToWatchlist('movie', Number(this?.data.id), false)
          .subscribe((res) => {
            this.toastService.success('Thao tác thành công!');
            if (this.accountStates) {
              this.removeFromList.emit(this.data);
            }
          });
      } else {
        this.accountService
          .addToWatchlist('tv', Number(this?.data.id), false)
          .subscribe((res) => {
            this.toastService.success('Thao tác thành công!');
            if (this.accountStates) {
              this.removeFromList.emit(this.data);
            }
          });
      }
    } else {
      if (this.mediaType === 'movie') {
        this.accountService
          .markAsFavorite('movie', Number(this?.data.id), false)
          .subscribe((res) => {
            this.toastService.success('Thao tác thành công!');
            if (this.accountStates) {
              this.removeFromList.emit(this.data);
            }
          });
      } else {
        this.accountService
          .markAsFavorite('tv', Number(this?.data.id), false)
          .subscribe((res) => {
            this.toastService.success('Thao tác thành công!');
            if (this.accountStates) {
              this.removeFromList.emit(this.data);
            }
          });
      }
    }
  }
  renderLink() {
    if (this.mediaType === 'movie') {
      return `/movies/details/${this.data.id}`;
    } else {
      return `/tv_shows/details/${this.data.id}`;
    }
  }

  renderTitle() {
    if (this.mediaType === 'movie') {
      return this.data.title;
    } else {
      return this.data.name;
    }
  }

  renderDate() {
    if (this.mediaType === 'movie') {
      return this.data.release_date;
    } else {
      return this.data.first_air_date;
    }
  }
}

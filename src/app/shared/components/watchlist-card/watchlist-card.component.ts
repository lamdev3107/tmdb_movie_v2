import { ActivatedRoute } from '@angular/router';
import { AccountStates } from './../../../core/models/account.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '@core/services/account.service';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { ToastService } from '@core/services/toast.service';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';
import { MovieService } from '@features/client/movies/services/movie.service';
import { Movie } from '@features/client/movies/models/movie.model';
import { AuthService } from '@core/services/auth.service';
import { RatingModalService } from '@core/services/rating-modal.service';
import { RatingService } from '@core/services/rating.service';

@Component({
  selector: 'app-watchlist-card',
  templateUrl: './watchlist-card.component.html',
  styleUrls: ['./watchlist-card.component.scss'],
})
export class WatchlistCardComponent implements OnInit {
  @Input() data!: Movie;
  credential: any | null = null;

  @Output() removeFromList = new EventEmitter<any>();
  @Output() reloadList = new EventEmitter<any>();
  accountStates: AccountStates | null = null;
  constructor(
    private movieService: MovieService,
    private accountService: AccountService,
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private ratingModalService: RatingModalService,
    private ratingService: RatingService
  ) {}
  currentRoute: string = 'watchlist';
  // Lấy ra watchlist trên url
  filmlist: any = [];

  ngOnInit(): void {
    this.credential = this.authService.getCredential();

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
    this.movieService
      .getMovieAccountStates(Number(this.data.id))
      .subscribe((res) => {
        this.accountStates = {
          inFavourite: res.inFavourite,
          inUserList: res.inUserList,
          isRated: res.isRated,
          ratingScore: res.ratingScore,
        };
      });
  }
  handleToggleFavorite() {
    if (this.accountStates?.inFavourite) {
      this.accountService
        .removeMovieFromFavorite(Number(this.data.id))
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.inFavourite = !this.accountStates.inFavourite;
          }
        });
    } else {
      this.accountService
        .addMovieToFavorite(Number(this.data.id), Number(this.credential?.id))
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.inFavourite = !this.accountStates.inFavourite;
          }
        });
    }
  }

  handleRating() {
    this.ratingModalService.open({
      movie: this.data as Movie,
      onClose: () => {
        this.loadAccountStatus();
        this.reloadList.emit();
      },
    });
  }

  // handleToggleWatchlist() {
  //   if (this.mediaType === 'movie') {
  //     this.accountService
  //       .addToWatchlist(
  //         'movie',
  //         Number(this.data.id),
  //         !this.accountStates?.watchlist
  //       )
  //       .subscribe((res) => {
  //         this.toastService.success('Thao tác thành công!');
  //         if (this.accountStates) {
  //           this.accountStates.watchlist = !this.accountStates.watchlist;
  //         }
  //       });
  //   } else {
  //     this.accountService
  //       .addToWatchlist(
  //         'tv',
  //         Number(this.data.id),
  //         !this.accountStates?.watchlist
  //       )
  //       .subscribe((res) => {
  //         this.toastService.success('Thao tác thành công!');
  //         if (this.accountStates) {
  //           this.accountStates.watchlist = !this.accountStates.watchlist;
  //         }
  //       });
  //   }
  // }

  handleRemoveFromlist() {
    this.accountService
      .removeMovieFromFavorite(Number(this?.data.id))
      .subscribe((res) => {
        this.toastService.success('Thao tác thành công!');
        if (this.accountStates) {
          this.removeFromList.emit(this.data);
        }
      });
  }
  renderLink() {
    return `/movies/details/${this.data.id}`;
  }

  renderTitle() {
    return this.data.title;
  }

  renderDate() {
    return this.data.releaseDate;
  }
}

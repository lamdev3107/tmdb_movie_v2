import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie, TrailerItem } from '../../models/movie.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '@core/services/account.service';
import { ToastService } from '@core/services/toast.service';
import { AccountStates } from '@core/models/account.model';
import { AuthService } from '@core/services/auth.service';
import { RatingModalService } from '@core/services/rating-modal.service';
import { ListModalService } from '@core/services/list-modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-detail-hero',
  templateUrl: './movie-detail-hero.component.html',
  styleUrls: ['./movie-detail-hero.component.scss'],
})
export class MovieDetailHeroComponent implements OnInit {
  // imageBaseUrl = environment.imageBaseUrl;
  credential: any | null = null;

  id: number | null = null;
  @Input() movie: Movie | null = null;
  @Output() reloadMoviDetail = new EventEmitter<void>();
  age: string = '';
  openTrailerModal = false;
  trailer: string | null = null;
  genres: string = '';
  disablePlayTrailer = false;
  favoriteMovie: Movie[] = [];

  isFavorite: boolean = false;
  isAdded: boolean = false;
  isRated: boolean = false;

  constructor(
    private movieService: MovieService,
    private accountService: AccountService,
    private toastService: ToastService,
    private authService: AuthService,
    private ratingModalService: RatingModalService,
    private listModalService: ListModalService,
    private router: Router
  ) {}

  accountStates: AccountStates | null = null;

  // openListModal() {
  //   this.listModalService.open({
  //     movie: this.movie as Movie,
  //     onClose: () => {
  //       console.log('close');
  //       // this.reloadMoviDetail.emit();
  //     },
  //   });
  // }

  openRating() {
    if (!this.credential || !this.credential.id) {
      alert('Please login to rate this movie');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.ratingModalService.open({
      movie: this.movie as Movie,
      onClose: () => {
        // INSERT_YOUR_CODE
        this.reloadMoviDetail.emit();
      },
    });
  }
  ngOnInit(): void {
    this.credential = this.authService.getCredential();
    this.genres =
      this.movie?.genres.map((genre) => genre.name).join(', ') || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie'] && changes['movie'].currentValue) {
      this.movie = changes['movie'].currentValue;
      this.genres =
        changes['movie'].currentValue.genres
          .map((genre: any) => genre.name)
          .join(', ') || '';
      this.age = changes['movie'].currentValue.adult ? 'R' : 'PG-13';
      this.id = changes['movie'].currentValue.id;
      this.trailer = changes['movie'].currentValue.trailerUrl;
      this.loadMovieStatus();
    }
  }

  handleToggleLikeBtn() {
    if (!this.credential || !this.credential.id) {
      alert('Please login to add this movie to your favorite');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.accountStates?.inFavourite) {
      this.accountService
        .removeMovieFromFavorite(Number(this.id))
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.inFavourite = !this.accountStates.inFavourite;
          }
        });
      return;
    }
    this.accountService
      .addMovieToFavorite(Number(this.id), Number(this.credential?.id))
      .subscribe((res) => {
        if (res) {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.inFavourite = !this.accountStates.inFavourite;
          }
        }
      });
  }

  // handleToggleAddBtn() {
  //   this.accountService
  //     .addToWatchlist(
  //       'movie',
  //       Number(this?.movie?.id),
  //       !this.accountStates?.watchlist
  //     )
  //     .subscribe((res) => {
  //       if (res) {
  //         this.toastService.success('Thao tác thành công!');
  //         if (this.accountStates) {
  //           this.accountStates.watchlist = !this.accountStates.watchlist;
  //         }
  //       }
  //     });
  // }

  loadMovieStatus() {
    this.movieService
      .getMovieAccountStates(Number(this.movie?.id))
      .subscribe((res) => {
        this.accountStates = {
          inFavourite: res.inFavourite,
          inUserList: res.inUserList,
          isRated: res.isRated,
          ratingScore: res.ratingScore,
        };
      });
  }

  onPlayTrailer(): void {
    if (this.disablePlayTrailer && !this.trailer) {
      return;
    }
    this.openTrailerModal = true;
  }

  onCloseTrailerModal(): void {
    this.openTrailerModal = false;
  }
}

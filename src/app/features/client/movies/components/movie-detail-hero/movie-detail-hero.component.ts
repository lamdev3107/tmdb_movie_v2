import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieDetail, TrailerItem } from '../../models/movie.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '@core/services/account.service';
import { ToastService } from '@core/services/toast.service';
import { AccountStates } from '@core/models/account.model';

@Component({
  selector: 'app-movie-detail-hero',
  templateUrl: './movie-detail-hero.component.html',
  styleUrls: ['./movie-detail-hero.component.scss'],
})
export class MovieDetailHeroComponent implements OnInit {
  imageBaseUrl = environment.imageBaseUrl;
  id: number | null = null;
  @Input() movie: MovieDetail | null = null;
  age: string = '';
  openTrailerModal = false;
  trailer: TrailerItem | null = null;
  genres: string = '';
  disablePlayTrailer = false;
  favoriteMovie: Movie[] = [];

  isFavorite: boolean = false;
  isAdded: boolean = false;
  isRated: boolean = false;

  constructor(
    private movieService: MovieService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}

  accountStates: AccountStates | null = null;

  ngOnInit(): void {
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
      this.loadTraier();
      this.loadMovieStatus();
    }
  }

  handleToggleLikeBtn() {
    this.accountService
      .markAsFavorite(
        'movie',
        Number(this?.movie?.id),
        !this.accountStates?.favorite
      )
      .subscribe((res) => {
        if (res) {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.favorite = !this.accountStates.favorite;
          }
        }
      });
  }

  handleToggleAddBtn() {
    this.accountService
      .addToWatchlist(
        'movie',
        Number(this?.movie?.id),
        !this.accountStates?.watchlist
      )
      .subscribe((res) => {
        if (res) {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.watchlist = !this.accountStates.watchlist;
          }
        }
      });
  }

  loadMovieStatus() {
    this.movieService
      .getMovieAccountStates(Number(this.id))
      .subscribe((res) => {
        this.accountStates = res;
      });
  }

  onPlayTrailer(): void {
    if (this.disablePlayTrailer && !this.trailer) {
      return;
    }
    this.openTrailerModal = true;
  }

  loadTraier() {
    this.movieService.getMovieTrailer(this.id as number).subscribe((res) => {
      if (res === null) {
        this.disablePlayTrailer = true;
        return;
      }
      this.trailer = res;
    });
  }

  onCloseTrailerModal(): void {
    this.openTrailerModal = false;
  }
}

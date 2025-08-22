import { Component, OnInit, OnDestroy } from '@angular/core';
import { GenreService } from '../../../../../core/services/genre.service';
import { Genre } from '../../../../../core/models/genre.model';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';

import {
  TVShowCategoryEnum,
  TVShowService,
} from '@features/client/services/tv-shows.service';
import {
  ListTVShowResponse,
  TVShow,
} from '@features/client/tv-shows/models/tv-show.model';
import {
  ListMovieResponse,
  Movie,
  TrailerItem,
} from '@features/client/movies/models/movie.model';
import {
  MovieCategoryEnum,
  MovieService,
} from '@features/client/movies/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  movieGenres: Genre[] = [];
  popularMovieList: Movie[] = [];
  topRatedMovieList: Movie[] = [];
  trailerList: TrailerItem[] = [];
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng ký

  constructor(
    private genreService: GenreService,
    private movieService: MovieService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadMovieGenres();
    this.loadTopRatedMovieLists();
    this.loadPopularMovieLists();
  }

  loadMovieGenres(): void {
    this.loadingService.show();
    this.genreService.getMovieGenreList();
  }

  loadTopRatedMovieLists(): void {
    this.loadingService.show();
    this.movieService
      .getMoviesByCategory(MovieCategoryEnum.TOP_RATED)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res: any) => {
          this.topRatedMovieList = res.data;
        },
        error: (err) => {
          console.error('Error fetching trending movie list', err);
        },
      });
  }

  loadPopularMovieLists(): void {
    this.loadingService.show();
    this.movieService
      .getMoviesByCategory(MovieCategoryEnum.POPULAR)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res: any) => {
          this.popularMovieList = res.data;
        },
        error: (err: any) => {
          console.error('Error fetching popular tv show list', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Phát ra giá trị để thông báo takeUntil
    this.destroy$.complete(); // Hoàn thành Subject để giải phóng tài nguyên
  }
}

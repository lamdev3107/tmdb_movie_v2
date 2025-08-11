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
import { MovieService } from '@features/client/movies/services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  movieGenres: Genre[] = [];
  trendingMovieList: Movie[] = [];
  popularTVShowList: TVShow[] = [];
  trailerList: TrailerItem[] = [];
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng ký

  trendingOptions = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
  ];
  selectedTimeWindow: string = 'day';

  constructor(
    private genreService: GenreService,
    private movieService: MovieService,
    private tvShowService: TVShowService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadMovieGenres();
    this.loadTrendingMovieLists();
    this.loadPopularTVShowLists();
    this.loadTrailers();
  }

  onTrendingWindowChanged(newValue: string) {
    this.selectedTimeWindow = newValue;
    this.loadTrendingMovieLists();
  }

  loadMovieGenres(): void {
    this.loadingService.show();
    this.genreService.getMovieGenreList();
  }
  loadTrailers(): void {
    this.loadingService.show();
    this.movieService
      .getLatestTrailers()
      .pipe(
        take(1),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.trailerList = res;
        },
        error: (err) => {
          console.log('Error fetching trailers', err);
        },
      });
  }
  loadTrendingMovieLists(): void {
    this.loadingService.show();
    this.movieService
      .getTrendingMovies(this.selectedTimeWindow)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res: ListMovieResponse) => {
          this.trendingMovieList = res.results;
        },
        error: (err) => {
          console.error('Error fetching trending movie list', err);
        },
      });
  }

  loadPopularTVShowLists(): void {
    this.loadingService.show();
    this.tvShowService
      .getTVShowsByCategory(TVShowCategoryEnum.POPULAR)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res: ListTVShowResponse) => {
          this.popularTVShowList = res.results;
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

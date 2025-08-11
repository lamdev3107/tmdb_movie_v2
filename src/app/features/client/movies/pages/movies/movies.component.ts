import { LoadingService } from 'src/app/core/services/loading.service';
import { Component, OnInit } from '@angular/core';
import { MovieCategoryEnum, MovieService } from '../../services/movie.service';

import { finalize, Subject, takeUntil } from 'rxjs';
import { ListMovieResponse, Movie } from '../../models/movie.model';
import { CardType } from '@core/utils/enums';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng ký
  movies: Movie[] = [];
  category: string = MovieCategoryEnum.POPULAR;
  page = 1;
  sortBy: string = '';
  cardType: CardType = CardType.MOVIE;

  filterObj: any = {};

  constructor(
    private movieService: MovieService,
    public loadingService: LoadingService
  ) {}
  ngOnInit() {
    this.loadCategoryMovies(this.category as MovieCategoryEnum, this.page);
  }

  handleCategoryChange(category: string) {
    this.resetMovies();
    this.category = category;
    this.loadCategoryMovies(this.category as MovieCategoryEnum, this.page);
    this.filterObj = {};
  }

  handleLoadMore() {
    this.page += 1;
    this.loadFilterMovies();
  }

  handleFilter(filterObj: any) {
    this.filterObj = filterObj;
    this.page = 1;
    this.movies = [];
    this.loadFilterMovies();
  }

  resetMovies() {
    this.movies = [];
    this.page = 1;
  }
  loadCategoryMovies(category: MovieCategoryEnum, page: number): void {
    this.loadingService.show();
    this.movieService
      .getMoviesByCategory(category, page)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res: ListMovieResponse) => {
          this.movies = [...this.movies, ...res.results];
        },
        error: (err) => {
          console.error('Error fetching trending movie list', err);
        },
      });
  }
  loadFilterMovies() {
    this.resetMovies();
    this.loadingService.show();
    this.movieService
      .discoverMovie(this.filterObj, this.page)
      .pipe(
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res: ListMovieResponse) => {
          this.movies = [...this.movies, ...res.results];
        },
      });
  }
}

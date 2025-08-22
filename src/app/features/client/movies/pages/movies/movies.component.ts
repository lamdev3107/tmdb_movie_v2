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
  size = 10;
  sortBy: string = '';
  cardType: CardType = CardType.MOVIE;
  searchQuery = '';
  totalPages = 0;
  currentPage = 1;

  filterObj: any = {};

  constructor(
    private movieService: MovieService,
    public loadingService: LoadingService
  ) {}
  ngOnInit() {
    this.loadCategoryMovies(
      this.category as MovieCategoryEnum,
      this.currentPage
    );
    this.loadFilterMovies();
  }

  handleCategoryChange(category: string) {
    this.resetMovies();
    this.category = category;
    this.loadCategoryMovies(
      this.category as MovieCategoryEnum,
      this.currentPage
    );
    this.filterObj = {};
  }

  handlePageChange(page: number) {
    this.currentPage = page++;
    this.loadFilterMovies(this.currentPage, this.size);
  }

  handleFilter(filterObj: any) {
    this.filterObj = filterObj;
    this.currentPage = 1;
    this.movies = [];
    this.loadFilterMovies();
  }

  resetMovies() {
    this.movies = [];
    this.currentPage = 1;
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
  loadFilterMovies(page: number = 1, size: number = 10) {
    this.resetMovies();
    this.loadingService.show();
    this.movieService
      .searchMovie(this.filterObj, page, size)
      .pipe(
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res: any) => {
          this.movies = [...this.movies, ...res.data.results];
          this.currentPage = res.data.metaInfo.page;
          this.totalPages = res.data.metaInfo.totalPages;
        },
      });
  }
}

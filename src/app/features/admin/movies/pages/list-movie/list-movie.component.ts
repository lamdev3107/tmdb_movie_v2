import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast.service';
import { MovieService } from '../../services/movie.service';
import { MovieResponseData } from '../../models/movie.model';

@Component({
  selector: 'app-list-movie',
  templateUrl: './list-movie.component.html',
  styleUrls: ['./list-movie.component.scss'],
})
export class ListMovieComponent implements OnInit {
  movies: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalResults = 0;
  loading = false;
  searchQuery = '';
  private debounceTimeout: any;
  constructor(
    private movieService: MovieService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMovie();
  }
  loadMovie(page: number = 1, size: number = 6, keyword: string = ''): void {
    this.loading = true;
    this.movieService.getMovies(page, size, keyword).subscribe({
      next: (response: any) => {
        const { metaInfo, results } = response;
        this.movies = results;
        this.currentPage = metaInfo.page;
        this.totalPages = metaInfo.totalPages;
        this.totalResults = metaInfo.total;
        this.loading = false;
        console.log('check movie', this.movies);
      },
      error: (error) => {
        console.error('Error loading people:', error);
        this.loading = false;
      },
    });
  }

  onSearchQueryChange(keyword: string): void {
    // Sử dụng debounce 500ms thì mới gọi loadPeople
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    this.searchQuery = keyword;
    this.debounceTimeout = setTimeout(() => {
      this.loadMovie(1, 6, this.searchQuery);
    }, 500);
  }

  handleClickAddBtn(): void {
    this.router.navigate(['/admin/movies/create']);
  }

  onPageChange(page: number): void {
    this.currentPage = page++;
    this.loadMovie(this.currentPage, 6, this.searchQuery);
  }

  deleteMovie(id: number): void {
    if (confirm(`Bạn có chắc chắn muốn xóa phim có id là ${id}?`)) {
      this.movieService.deleteMovie(id).subscribe({
        next: () => {
          this.toastService.success('Xóa phim thành công!');
          this.loadMovie();
        },
      });
    }
  }

  renderMovieGenres(genres: any[]): string {
    return genres.map((genre) => genre.name).join(', ');
  }

  handleClickEditBtn(id: number): void {
    this.router.navigate(['/admin/movies/edit', id]);
  }

  trackByMovieId(index: number, movie: any): number {
    return movie.id;
  }
}

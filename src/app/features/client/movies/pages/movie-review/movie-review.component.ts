import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Review } from '@core/models/review.model';
import { MovieDetail } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-review',
  templateUrl: './movie-review.component.html',
  styleUrls: ['./movie-review.component.scss'],
})
export class MovieReviewComponent implements OnInit {
  reviews: Review[] = [];
  movieId: string | null = null;
  movie: MovieDetail | null = null;
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng

  constructor(
    private movieService: MovieService,
    public loadingService: LoadingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.movieId = params.get('id');
      this.loadMovieReview(this.movieId);
      this.loadMovieDetails(this.movieId);
    });
  }
  loadMovieDetails(movieId: string | null): void {
    this.loadingService.show();
    this.movieService
      .getMovieDetails(Number(movieId))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.movie = res;
        },
        error: (err) => {
          console.log('Error fetching trailers', err);
        },
      });
  }
  loadMovieReview(movieId: string | null) {
    this.loadingService.show();
    this.movieService
      .getMovieReviews(Number(movieId))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.reviews = res.results;
        },
      });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieCast } from '../../models/credit.model';

@Component({
  selector: 'app-movie-cast',
  templateUrl: './movie-cast.component.html',
  styleUrls: ['./movie-cast.component.scss'],
})
export class MovieCastComponent implements OnInit {
  movieId: string | null = null;
  movie: Movie | null = null;
  casts: MovieCast[] = [];
  crew: MovieCast[] = [];
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng

  constructor(
    private movieService: MovieService,
    public loadingService: LoadingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.movieId = params.get('id');
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
          this.movie = res.data.movie;
          this.casts = res.data.casting;
          this.crew = res.data.crew;
        },
        error: (err) => {
          console.log('Error fetching trailers', err);
        },
      });
  }
}

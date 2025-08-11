import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MovieDetail } from '../../models/movie.model';
import { Cast, Crew } from '../../models/credit.model';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-cast',
  templateUrl: './movie-cast.component.html',
  styleUrls: ['./movie-cast.component.scss'],
})
export class MovieCastComponent implements OnInit {
  movieId: string | null = null;
  movie: MovieDetail | null = null;
  casts: Cast[] = [];
  crew: Crew[] = [];
  crewByDepartment: Record<string, Crew[]> = {};
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng

  constructor(
    private movieService: MovieService,
    public loadingService: LoadingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.movieId = params.get('id');
      this.loadMovieCredits(this.movieId);
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

  loadMovieCredits(movieId: string | null) {
    this.loadingService.show();

    this.movieService
      .getMovieCredits(Number(movieId))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingService.hide()) // luôn hide loading dù success hay error
      )
      .subscribe({
        next: (res) => {
          this.casts = res.cast;
          this.crew = res.crew;
          console.log('check crew', this.crew);
          this.groupCrewByDepartment(res.crew);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  private groupCrewByDepartment(crew: Crew[]) {
    this.crewByDepartment = crew.reduce((acc: any, member: any) => {
      const dept = member.department;
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(member);
      return acc;
    }, {});
  }
}

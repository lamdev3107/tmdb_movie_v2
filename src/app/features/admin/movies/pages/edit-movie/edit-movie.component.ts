import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { MovieBody } from '../../models/movie.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-movie',
  templateUrl: './edit-movie.component.html',
  styleUrls: ['./edit-movie.component.scss'],
})
export class EditMovieComponent implements OnInit, OnDestroy {
  movieData?: MovieBody;
  isLoading = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private moviesService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id');
    if (movieId) {
      this.loadMovie(parseInt(movieId));
    } else {
      this.router.navigate(['/admin/movies']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMovie(movieId: number): void {
    this.moviesService
      .getMovie(movieId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.movieData = res.data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading movie:', error);
          this.router.navigate(['/admin/movies']);
        },
      });
  }
}

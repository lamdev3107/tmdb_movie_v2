import { Component, OnInit } from '@angular/core';
import { Cast, MovieCast } from '../../models/credit.model';
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, Subject, takeUntil } from 'rxjs';
import { Movie } from '../../models/movie.model';
import { Keyword } from '../../models/keyword.model';
import { LoadingService } from '@core/services/loading.service';
import { TabItem } from '@shared/components/tab/tab.component';
import { CardType } from '@core/utils/enums';
import { AccountService } from '@core/services/account.service';
import { Review } from '@core/models/review.model';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movieId: string | null = null;
  castList: MovieCast[] = [];
  crewList: MovieCast[] = [];
  keywords: Keyword[] = [];
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng
  movie: Movie | null = null;
  review: Review | null = null;
  recommendations: any[] = [];
  cardType = CardType.CAST;

  socialTab: TabItem[] = [{ id: 'reviews', label: 'Reviews' }];
  mediaTabs: TabItem[] = [
    { id: 'videos', label: 'Videos' },
    { id: 'posters', label: 'Posters' },
    { id: 'backdrops', label: 'Backdrops' },
  ];
  activeScocialTabId = 'reviews';
  activeTabId = 'videos';

  constructor(
    private movieService: MovieService,
    public route: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.movieId = params.get('id');
      this.loadMovieDetails(this.movieId);
      this.loadMovieRecommendations(this.movieId);
    });
  }

  onSocialTabChange(tabId: string) {
    this.activeScocialTabId = tabId;
  }

  onMediaTabChange(tabId: string) {
    this.activeTabId = tabId;
    if (tabId !== 'videos') {
      // this.loadImages(this.movieId);
    }
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
          this.castList = res.data.casting;
          this.crewList = res.data.crew;
        },
        error: (err) => {
          console.log('Error fetching trailers', err);
        },
      });
  }

  loadMovieReview(movieId: string | null) {
    this.movieService.getMovieReviews(Number(movieId)).subscribe({
      next: (res) => {
        this.review = res.results[0] as Review;
      },
    });
  }

  loadMovieRecommendations(movieId: string | null) {
    this.movieService
      .getMovieRecommendations(Number(movieId), 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.recommendations = res.data.results;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Phát ra giá trị để thông báo takeUntil
    this.destroy$.complete(); // Hoàn thành Subject để giải phóng tài nguyên
  }
}

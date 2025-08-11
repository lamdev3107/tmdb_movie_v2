import { Component, OnInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';

import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TVShowDetail } from '@features/client/tv-shows/models/tv-show.model';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { Review } from '@core/models/review.model';

@Component({
  selector: 'app-tv-show-review',
  templateUrl: './tv-show-review.component.html',
  styleUrls: ['./tv-show-review.component.scss'],
})
export class TVShowReviewComponent implements OnInit {
  reviews: Review[] = [];
  tvShowId: string | null = null;
  tvShow: TVShowDetail | null = null;
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng

  constructor(
    private tvShowService: TVShowService,
    public loadingService: LoadingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.tvShowId = params.get('id');
      this.loadTVShowReview(this.tvShowId);
      this.loadTVShowDetails(this.tvShowId);
    });
  }
  loadTVShowDetails(tvShowId: string | null): void {
    this.loadingService.show();
    this.tvShowService
      .getTVShowDetails(Number(tvShowId))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.tvShow = res;
        },
        error: (err) => {
          console.log('Error fetching trailers', err);
        },
      });
  }
  loadTVShowReview(tvShowId: string | null) {
    this.loadingService.show();
    this.tvShowService
      .getTVShowReviews(Number(tvShowId))
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

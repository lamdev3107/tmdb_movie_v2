import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from '@core/models/review.model';
import { LoadingService } from '@core/services/loading.service';
import {
  TVShow,
  TVShowDetail,
} from '@features/client/tv-shows/models/tv-show.model';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { TabItem } from '@shared/components/tab/tab.component';
import { finalize, map, Subject, takeUntil } from 'rxjs';
import { Video } from '@features/client/movies/models/video.model';
import { Image } from '@features/client/movies/models/images.model';
import { Cast } from '@features/client/movies/models/credit.model';
import { Keyword } from '@features/client/movies/models/keyword.model';

@Component({
  selector: 'app-tv-show-detail',
  templateUrl: './tv-show-detail.component.html',
  styleUrls: ['./tv-show-detail.component.scss'],
})
export class TvShowDetailComponent implements OnInit {
  tvShowId: string | null = null;
  castList: Cast[] = [];
  keywords: Keyword[] = [];
  imageBaseUrl = 'https://image.tmdb.org/t/p/w500/';
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng
  tvShow: TVShowDetail | null = null;
  review: Review | null = null;
  videos: Video[] = [];
  posters: Image[] = [];
  backdrops: Image[] = [];
  recommendations: TVShow[] = [];

  socialTab: TabItem[] = [{ id: 'reviews', label: 'Reviews' }];
  mediaTabs: TabItem[] = [
    { id: 'videos', label: 'Videos' },
    { id: 'posters', label: 'Posters' },
    { id: 'backdrops', label: 'Backdrops' },
  ];
  activeScocialTabId = 'reviews';
  activeTabId = 'videos';
  constructor(
    private tvShowService: TVShowService,
    private route: ActivatedRoute,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.tvShowId = params.get('id');
      this.loadTVShowDetails(this.tvShowId);
      this.loadTVShowKeywords(this.tvShowId);
      this.loadTVShowReview(this.tvShowId);
      this.loadTVShowRecommendations(this.tvShowId);
      this.loadTVShowCredits(this.tvShowId);
      this.loadTVShowVideos(this.tvShowId);
    });
  }

  onSocialTabChange(tabId: string) {
    this.activeScocialTabId = tabId;
  }

  onMediaTabChange(tabId: string) {
    this.activeTabId = tabId;
    if (tabId !== 'videos') {
      this.loadImages(this.tvShowId);
    }
  }

  loadTVShowVideos(tvShowId: string | null) {
    this.tvShowService
      .getTVShowVideos(Number(tvShowId))
      .pipe(
        takeUntil(this.destroy$),
        map((res: Video[]) => res.slice(0, 3))
      )
      .subscribe({
        next: (res) => {
          this.videos = res;
        },
      });
  }

  loadImages(tvShowId: string | null) {
    this.loadingService.show();
    this.tvShowService
      .getTVShowImages(Number(tvShowId))
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loadingService.hide();
        })
      )
      .subscribe({
        next: (res) => {
          this.posters = res.posters.slice(0, 5);
          this.backdrops = res.backdrops.slice(0, 5);
        },
      });
  }

  loadTVShowDetails(tvShowId: string | null): void {
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

  loadTVShowKeywords(tvShowId: string | null) {
    this.tvShowService
      .getTVShowKeywords(Number(tvShowId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.keywords = res;
        },
      });
  }

  loadTVShowReview(tvShowId: string | null) {
    this.tvShowService.getTVShowReviews(Number(tvShowId)).subscribe({
      next: (res) => {
        this.review = res.results[0] as Review;
      },
    });
  }

  loadTVShowRecommendations(tvShowId: string | null) {
    this.tvShowService
      .getTVShowRecommendations(Number(tvShowId))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.recommendations = res;
        },
      });
  }

  loadTVShowCredits(tvShowId: string | null) {
    this.loadingService.show();

    this.tvShowService
      .getTopBilledCast(Number(tvShowId))
      .pipe(
        // Dòng này sử dụng toán tử takeUntil để tự động hủy (unsubscribe) Observable khi destroy$ phát ra giá trị,
        // giúp tránh rò rỉ bộ nhớ khi component bị hủy. Khi gọi destroy$.next(), tất cả các subscription đang lắng nghe sẽ bị dừng lại.
        takeUntil(this.destroy$),
        finalize(() => this.loadingService.hide()) // luôn hide loading dù success hay error
      )
      .subscribe({
        next: (res: Cast[]) => {
          this.castList = res;
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(); // Phát ra giá trị để thông báo takeUntil
    this.destroy$.complete(); // Hoàn thành Subject để giải phóng tài nguyên
  }
}

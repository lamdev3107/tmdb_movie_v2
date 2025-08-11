import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';

import { finalize, Subject, takeUntil } from 'rxjs';
import { Cast, Crew } from '@features/client/movies/models/credit.model';
import { TVShowDetail } from '../../models/tv-show.model';
import { TVShowService } from '../../services/tv-shows.service';

@Component({
  selector: 'app-movie-cast',
  templateUrl: './tv-show-cast.component.html',
  styleUrls: ['./tv-show-cast.component.scss'],
})
export class TVShowCastComponent implements OnInit {
  tvShowId: string | null = null;
  tvShow: TVShowDetail | null = null;
  casts: Cast[] = [];
  crew: Crew[] = [];
  crewByDepartment: Record<string, Crew[]> = {};
  private destroy$ = new Subject<void>(); // Subject để quản lý hủy đăng

  constructor(
    private tvShowService: TVShowService,
    public loadingService: LoadingService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.tvShowId = params.get('id');
      this.loadTVShowCredits(this.tvShowId);
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

  loadTVShowCredits(tvShowId: string | null) {
    this.loadingService.show();

    this.tvShowService
      .getTVShowCredits(Number(tvShowId))
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

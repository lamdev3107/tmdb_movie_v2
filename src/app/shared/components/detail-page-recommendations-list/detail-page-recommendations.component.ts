import { Component, Input, OnInit } from '@angular/core';

interface BaseRecommendation {
  id: number;
  backdrop_path?: string;
  poster_path?: string;
  title?: string;
  name?: string;
  vote_average: number;
}

@Component({
  selector: 'app-detail-page-recommendations',
  templateUrl: './detail-page-recommendations.component.html',
  styleUrls: ['./detail-page-recommendations.component.scss'],
})
export class DetailPageRecommendationComponent implements OnInit {
  @Input() recommendations: BaseRecommendation[] = [];
  @Input() type: 'movie' | 'tv' = 'movie';

  constructor() {}

  ngOnInit(): void {}

  getRouteLink(id: number): string[] {
    return this.type === 'movie'
      ? ['/movies', id.toString()]
      : ['/tv', id.toString()];
  }
}

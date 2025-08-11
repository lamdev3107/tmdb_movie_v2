import { Component, Input, SimpleChanges } from '@angular/core';
import { Review } from '@core/models/review.model';

@Component({
  selector: 'app-review-card',
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.scss'],
})
export class ReviewCardComponent {
  @Input() review: Review | null = null;
  imgBaseUrl = 'https://image.tmdb.org/t/p/original';

  get formattedDate(): string {
    if (!this.review?.created_at) return '';
    return new Date(this.review.created_at).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['review']) {
      console.log('check review', this.review);
    }
  }
}

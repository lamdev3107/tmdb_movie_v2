import { Component, Input } from '@angular/core';

export type SkeletonType =
  | 'text'
  | 'avatar'
  | 'card'
  | 'list-item'
  | 'cast-item'
  | 'review-card';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  styleUrls: ['./skeleton.component.scss'],
})
export class SkeletonComponent {
  @Input() type: SkeletonType = 'text';
  @Input() width: string = '100%';
  @Input() height: string = 'auto';
  @Input() count: number = 1;
  @Input() aspectRatio: string = '1/1';
  @Input() borderRadius: string = '4px';
  @Input() className: string = '';

  get skeletonItems(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }

  get skeletonStyles(): { [key: string]: string } {
    return {
      width: this.width,
      height: this.height,
      aspectRatio: this.aspectRatio,
      borderRadius: this.borderRadius,
    };
  }
}

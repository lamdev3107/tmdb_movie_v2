import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-user-score',
  templateUrl: './user-score.component.html',
  styleUrls: ['./user-score.component.scss'],
})
export class UserScoreComponent implements OnInit, OnChanges {
  @Input() size: string = 'medium';
  @Input() score: number | undefined | null = 0;

  radius: number = 40; // Bán kính mặc định
  fontSize: number = 24; // Kích thước font mặc định
  strokeWidth: number = 6;
  padding: number = 10;

  get width(): number {
    return this.radius * 2 + this.padding; // +20 để padding cho stroke
  }
  get height(): number {
    return this.radius * 2 + this.padding;
  }

  progressPercentage: number = 0;
  strokeDasharray: string = '';
  strokeDashoffset: string = '';
  ringColor: string = '#4ade80';

  ngOnInit(): void {
    this.calculateProgress();
  }

  setRingColor(): void {
    this.ringColor = this.scoreColor;
  }
  setSize(): void {
    if (this.size === 'small') {
      this.radius = 16;
      this.fontSize = 12;
      this.strokeWidth = 4;
      this.padding = 10;
    }
    if (this.size === 'medium') {
      this.radius = 24;
      this.fontSize = 16;
      this.strokeWidth = 6;
      this.padding = 15;
    }
    if (this.size === 'large') {
      this.radius = 32;
      this.fontSize = 20;
      this.strokeWidth = 10;
      this.padding = 20;
    }
  }
  get scoreColor(): string {
    if (this.progressPercentage <= 50) {
      return '#ef4444'; // Đỏ
    } else if (this.progressPercentage <= 60) {
      return '#f59e42'; // Cam
    } else if (this.progressPercentage <= 70) {
      return '#ced141'; // Vàng
    } else {
      return '#34c085'; // Xanh lá
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size']) {
      this.setSize();
    }
    if (changes['score']) {
      this.score = Math.round((this.score || 0) * 10);
      this.calculateProgress();
    }
  }

  private calculateProgress(): void {
    const scoreValue = this.score || 0;
    this.progressPercentage = Math.min(Math.max(scoreValue, 0), 100);

    // Tính toán cho SVG circle dựa trên bán kính động
    const circumference = 2 * Math.PI * this.radius;
    const progress = (this.progressPercentage / 100) * circumference;

    this.strokeDasharray = circumference.toString();
    this.strokeDashoffset = (circumference - progress).toString();
  }
}

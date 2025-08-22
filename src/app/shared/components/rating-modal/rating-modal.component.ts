import { AuthService } from '@core/services/auth.service';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  RatingModalConfig,
  RatingModalService,
} from '@core/services/rating-modal.service';
import { RatingService } from '@core/services/rating.service';
import { MovieService } from '@features/client/movies/services/movie.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.scss'],
})
export class RatingModalComponent implements OnInit {
  credential: any | null = null;
  rating: number = 0;
  percentLabel: string = '0% user score';
  ticks: number[] = [];

  isOpen = false;
  config: RatingModalConfig | null = null;

  constructor(
    private modalService: RatingModalService,
    private ratingService: RatingService,
    private authService: AuthService,
    private toastService: ToastService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.credential = this.authService.getCredential();

    this.modalService.isOpen$.subscribe((open) => (this.isOpen = open));
    this.modalService.config$.subscribe((cfg) => {
      this.config = cfg;
      this.loadMovieRating();
    });

    this.generateTicks();
  }

  loadMovieRating() {
    this.ratingService
      .getMovieRating(this.config?.movie?.id as number)
      .subscribe({
        next: (res) => {
          this.rating = res.score;
          this.initFromInput();
        },
        error: (err) => {
          this.rating = 0;
          this.initFromInput();
        },
      });
  }
  close() {
    this.modalService.close();
    this.config?.onClose?.();
  }

  initFromInput(): void {
    this.updatePercentLabel();
  }

  onSliderInput(value: string): void {
    this.rating = Number(value);
    this.updatePercentLabel();
  }

  getTrackBackground(): string {
    const percent = ((this.rating - 0) / (100 - 0)) * 100;
    let color = '#34c085'; // green default
    if (percent <= 50) {
      color = '#ef4444'; // red
    } else if (percent <= 60) {
      color = '#f59e42'; // yellow
    } else if (percent <= 75) {
      color = '#ced141'; // yellow
    } else {
      color = '#34c085'; // green
    }
    return `linear-gradient(90deg, ${color} ${percent}%, #e6e6e6 ${percent}%)`;
  }

  updatePercentLabel(): void {
    this.percentLabel = `${this.rating}% user score`;
  }

  clearRating(): void {
    this.rating = 0;
    this.updatePercentLabel();
    // this.clearEvent.emit();
  }

  submitRating(): void {
    if (this.rating !== 0) {
      this.ratingService
        .createRating(
          this.credential.id,
          this.config?.movie?.id as number,
          this.rating
        )
        .subscribe((res) => {
          this.toastService.success('Rating submitted successfully');
          this.close();
        });
    } else {
      this.ratingService
        .deleteRating(this.credential.id, this.config?.movie?.id as number)
        .subscribe((res) => {
          this.toastService.success('Rating cleared successfully');
          this.close();
        });
    }
  }

  private generateTicks(): void {
    const tickStep = 10;
    const count = Math.floor((100 - 0) / tickStep);
    this.ticks = Array.from({ length: count + 1 }, (_, i) => 0 + i * tickStep);
  }
}

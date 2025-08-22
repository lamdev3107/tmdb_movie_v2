import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Movie, TrailerItem } from '@features/client/movies/models/movie.model';

@Component({
  selector: 'app-trailer-modal',
  templateUrl: './trailer-modal.component.html',
  styleUrls: ['./trailer-modal.component.scss'],
})
export class TrailerModalComponent implements OnInit {
  @Input() openModal: boolean = false;
  @Input() movie: Movie | null = null;
  safeYoutubeUrl: SafeResourceUrl | null = null;
  @Output() closeEvent = new EventEmitter<void>();
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['movie'] && changes['movie'].currentValue) {
      this.handleOnPlayTrailer(changes['movie'].currentValue.trailerUrl);
    }
  }

  handleOnPlayTrailer(trailer: string): void {
    const youtubeUrl = `https://www.youtube.com/embed/${trailer}`;
    this.safeYoutubeUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(youtubeUrl);
  }

  closeModal(): void {
    // this.safeYoutubeUrl = null;
    this.closeEvent.emit();
  }
}

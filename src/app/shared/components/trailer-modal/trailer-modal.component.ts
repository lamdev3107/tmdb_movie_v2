import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TrailerItem } from '@features/client/movies/models/movie.model';

@Component({
  selector: 'app-trailer-modal',
  templateUrl: './trailer-modal.component.html',
  styleUrls: ['./trailer-modal.component.scss'],
})
export class TrailerModalComponent implements OnInit {
  @Input() openModal: boolean = false;
  @Input() trailer: TrailerItem | null = null;
  safeYoutubeUrl: SafeResourceUrl | null = null;
  @Output() closeEvent = new EventEmitter<void>();
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trailer'] && changes['trailer'].currentValue) {
      this.handleOnPlayTrailer(changes['trailer'].currentValue);
    }
  }

  handleOnPlayTrailer(trailer: TrailerItem): void {
    this.safeYoutubeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      trailer.youtubeUrl
    );
  }

  closeModal(): void {
    // this.safeYoutubeUrl = null;
    this.closeEvent.emit();
  }
}

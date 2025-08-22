import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Movie, TrailerItem } from '@features/client/movies/models/movie.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trailer-card',
  templateUrl: './trailer-card.component.html',
  styleUrls: ['./trailer-card.component.scss'],
})
export class TrailerCardComponent implements OnInit {
  @Input() movie: Movie | null = null;
  @Output() clickTrailerEvent = new EventEmitter<Movie>();

  constructor() {}

  ngOnInit(): void {}
  onClickPlayBtn(): void {
    this.clickTrailerEvent.emit(this.movie as Movie);
  }
}

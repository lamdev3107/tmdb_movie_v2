import { Component, Input, OnInit } from '@angular/core';
import { Cast, Crew } from '@features/client/movies/models/credit.model';

@Component({
  selector: 'app-cast-card',
  templateUrl: './cast-card.component.html',
  styleUrls: ['./cast-card.component.scss'],
})
export class CastCardComponent implements OnInit {
  @Input() cast: Cast | null = null;
  @Input() crew: Crew | null = null;

  constructor() {}

  getCastId() {
    if (this.cast) return this.cast?.id;
    return this.crew?.id;
  }
  ngOnInit(): void {}
}

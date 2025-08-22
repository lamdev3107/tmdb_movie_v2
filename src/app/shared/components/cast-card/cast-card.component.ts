import { Component, Input, OnInit } from '@angular/core';
import {
  Cast,
  Crew,
  MovieCast,
} from '@features/client/movies/models/credit.model';

@Component({
  selector: 'app-cast-card',
  templateUrl: './cast-card.component.html',
  styleUrls: ['./cast-card.component.scss'],
})
export class CastCardComponent implements OnInit {
  @Input() cast: MovieCast | null = null;
  @Input() isCrew = false;
  constructor() {}

  getCastId() {
    return this.cast?.personDTO?.id;
  }
  ngOnInit(): void {}
}

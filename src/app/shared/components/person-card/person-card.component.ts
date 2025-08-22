import { Component, Input, OnInit } from '@angular/core';
import { MovieCast } from '@features/client/movies/models/credit.model';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss'],
})
export class PersonCardComponent implements OnInit {
  @Input() cast!: MovieCast;
  @Input() isLoading!: boolean | null;
  constructor() {}

  ngOnInit(): void {}
}

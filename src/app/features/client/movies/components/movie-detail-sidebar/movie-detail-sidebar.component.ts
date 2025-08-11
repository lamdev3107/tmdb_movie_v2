import { MovieDetail } from '../../models/movie.model';
import { Keyword } from './../../models/keyword.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-movie-detail-sidebar',
  templateUrl: './movie-detail-sidebar.component.html',
  styleUrls: ['./movie-detail-sidebar.component.scss'],
})
export class MovieDetailSidebarComponent implements OnInit {
  @Input() movie!: MovieDetail | null;
  @Input() keywords!: Keyword[] | null;
  constructor() {}

  ngOnInit(): void {}
}

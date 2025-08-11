import { Component, Input, OnInit } from '@angular/core';
import { Keyword } from '@features/client/movies/models/keyword.model';
import { TVShowDetail } from '@features/client/tv-shows/models/tv-show.model';

@Component({
  selector: 'app-tv-detail-sidebar',
  templateUrl: './tv-detail-sidebar.component.html',
  styleUrls: ['./tv-detail-sidebar.component.scss'],
})
export class TVDetailSidebarComponent implements OnInit {
  @Input() tvShow!: TVShowDetail | null;
  @Input() keywords!: Keyword[] | null;
  constructor() {}

  ngOnInit(): void {}
}

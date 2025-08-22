import { Component, Input, OnInit } from '@angular/core';
import { AdminPerson } from '@features/admin/people/models/admin-person.model';
import { Movie } from '@features/client/movies/models/movie.model';
import { Person } from '@features/client/people/models/person.model';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent implements OnInit {
  @Input() item!: AdminPerson | Movie;
  @Input() type!: 'tv' | 'person' | 'movie';
  constructor() {}

  ngOnInit(): void {}

  getItemTitle(item: any): string {
    if (this.type === 'movie') return item.title;
    return item.name;
  }

  getImagePath(item: any): string {
    if (this.type === 'person') {
      return item.profilePath
        ? `${item.profilePath}`
        : 'assets/images/default-avatar.jpg';
    }
    return item.posterPath ? item.posterPath : `assets/icons/picture.svg`;
  }

  getKnownForDepartment(item: any): string {
    if (this.type !== 'person') return '';
    return item.known_for_department;
  }

  getOverview(item: any): string {
    if (this.type === 'person') return '';
    else {
      return item.overview;
    }
  }

  getRouterLink(item: AdminPerson | Movie): string {
    switch (this.type) {
      case 'movie':
        return `/movies/details/${item.id}`;
      case 'tv':
        return `/tv_show/details/${item.id}`;
      default:
        return `/people/${item.id}`;
    }
  }
}

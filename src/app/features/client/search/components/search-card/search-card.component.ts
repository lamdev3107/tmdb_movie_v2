import { Component, Input, OnInit } from '@angular/core';
import { Movie } from '@features/client/movies/models/movie.model';
import { Person } from '@features/client/people/models/person.model';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';

@Component({
  selector: 'app-search-card',
  templateUrl: './search-card.component.html',
  styleUrls: ['./search-card.component.scss'],
})
export class SearchCardComponent implements OnInit {
  @Input() item!: Person | Movie | TVShow;
  @Input() type!: 'tv' | 'person' | 'movie';
  constructor() {}

  ngOnInit(): void {
    console.log('check item', this.item);
  }

  getItemTitle(item: any): string {
    if (this.type === 'movie') return item.title;
    return item.name;
  }

  getImagePath(item: any): string {
    if (this.type === 'person') {
      return item.profile_path
        ? `https://image.tmdb.org/t/p/w200${item.profile_path}`
        : 'assets/images/default-avatar.jpg';
    }
    return item.poster_path
      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
      : `assets/icons/picture.svg`;
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

  getRouterLink(item: Person | Movie | TVShow): string {
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

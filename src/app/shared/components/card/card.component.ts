import { Component, Input, OnInit } from '@angular/core';
import { CardType } from '@core/utils/enums';
import { Cast } from '@features/client/movies/models/credit.model';
import { Movie } from '@features/client/movies/models/movie.model';
import { Person } from '@features/client/people/models/person.model';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  moviePath = '/movies/details/';
  tvPath = '/tv_shows/details/';
  castPath = '/people/';
  hasImage = true;
  imageBaseUrl = environment.imageBaseUrl;
  @Input() data!: any;
  @Input() type: CardType = CardType.MOVIE;

  @Input() isLoading: boolean = false;

  posterPath: string = '';
  detailLink: string = '';

  // Expose enum to template
  CardType = CardType;

  constructor() {}

  getPosterPath() {
    switch (this.type) {
      case CardType.MOVIE:
        if ((this.data as Movie).poster_path) {
          this.hasImage = true;
          return this.imageBaseUrl + (this.data as Movie).poster_path;
        }
        this.hasImage = false;
        return 'assets/icons/picture.svg';
      case CardType.TV_SHOW:
        if ((this.data as TVShow).poster_path) {
          this.hasImage = true;
          return this.imageBaseUrl + (this.data as TVShow).poster_path;
        }
        this.hasImage = false;
        return 'assets/icons/picture.svg';
      case CardType.CAST:
        if ((this.data as Cast).profile_path) {
          this.hasImage = true;
          return this.imageBaseUrl + (this.data as Cast).profile_path;
        }
        this.hasImage = false;
        return 'assets/icons/picture.svg';
      default:
        this.hasImage = false;
        return 'assets/icons/picture.svg';
    }
  }

  renderScore() {
    switch (this.type) {
      case CardType.MOVIE:
        return (this.data as Movie).vote_average;
      case CardType.TV_SHOW:
        return (this.data as TVShow).vote_average;
      default:
        return 0;
    }
  }

  renderDate() {
    switch (this.type) {
      case CardType.MOVIE:
        return (this.data as Movie).release_date;
      case CardType.TV_SHOW:
        return (this.data as TVShow).first_air_date;
      default:
        return '';
    }
  }

  renderTitle() {
    switch (this.type) {
      case CardType.MOVIE:
        return (this.data as Movie).title;
      case CardType.TV_SHOW:
        return (this.data as TVShow).name;
      case CardType.CAST:
        return (this.data as Cast).name;

      default:
        return '';
    }
  }
  renderKnownForText(): string {
    if (
      !(this.data as Person).known_for ||
      (this.data as Person).known_for.length === 0
    ) {
      return 'Unknown';
    }
    return (this.data as Person).known_for
      .map((data: any) => {
        if (data.name) return data.name;
        return data.title;
      })
      .join(', ');
  }
  renderLink() {
    switch (this.type) {
      case CardType.MOVIE:
        return this.moviePath + String((this.data as Movie).id);
      case CardType.TV_SHOW:
        return this.tvPath + String((this.data as TVShow).id);
      case CardType.CAST:
        return this.castPath + String((this.data as Cast).id);
      default:
        return '';
    }
  }
  ngOnInit(): void {}
}

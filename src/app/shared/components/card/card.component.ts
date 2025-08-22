import { Component, Input, OnInit } from '@angular/core';
import { AccountStates } from '@core/models/account.model';
import { CardType } from '@core/utils/enums';
import { AdminPerson } from '@features/admin/people/models/admin-person.model';
import { Cast } from '@features/client/movies/models/credit.model';
import { Movie } from '@features/client/movies/models/movie.model';
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

  // showRatingModal = false;
  // accountStates: AccountStates | null = null;
  // handleRating(data: { data: Movie; accountStates: AccountStates }) {
  //   this.showRatingModal = true;
  //   this.accountStates = data.accountStates;
  // }
  // handleCloseRatingModal() {
  //   this.showRatingModal = false;
  // }

  constructor() {}

  getPosterPath() {
    switch (this.type) {
      case CardType.MOVIE:
        if ((this.data as Movie).posterPath) {
          this.hasImage = true;
          return (this.data as Movie).posterPath;
        }
        this.hasImage = false;
        return 'assets/icons/picture.svg';

      case CardType.CAST:
        if ((this.data as AdminPerson).profilePath) {
          this.hasImage = true;
          return (this.data as AdminPerson).profilePath;
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
        return (this.data as Movie).voteAverage;
      default:
        return 0;
    }
  }

  renderDate() {
    switch (this.type) {
      case CardType.MOVIE:
        return (this.data as Movie).releaseDate;
      default:
        return '';
    }
  }

  renderTitle() {
    switch (this.type) {
      case CardType.MOVIE:
        return (this.data as Movie).title;
      case CardType.CAST:
        return (this.data as Cast).name;

      default:
        return '';
    }
  }
  renderKnownForText(): string {
    if (
      (this.data as AdminPerson).career &&
      (this.data as AdminPerson).career === ''
    ) {
      return 'Unknown';
    }
    return (this.data as AdminPerson).career;
  }
  renderLink() {
    switch (this.type) {
      case CardType.MOVIE:
        return this.moviePath + String((this.data as AdminPerson).id);
      case CardType.CAST:
        return this.castPath + String((this.data as AdminPerson).id);
      default:
        return '';
    }
  }
  ngOnInit(): void {}
}

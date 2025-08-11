import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  Input,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';
import { CardType } from '@core/utils/enums';
import { AccountStates } from '@core/models/account.model';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { ToastService } from '@core/services/toast.service';
import { AccountService } from '@core/services/account.service';
import { MovieService } from '@features/client/movies/services/movie.service';
import { Movie, MovieDetail } from '@features/client/movies/models/movie.model';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
})
export class ActionMenuComponent implements OnChanges {
  isOpen = false;
  @Input() type: CardType = CardType.MOVIE;
  @Input() data?: any = null;

  id: number | null = null;

  showRatingModal: boolean = false;

  accountStates: AccountStates | null = null;

  constructor(
    private movieService: MovieService,
    private tvShowService: TVShowService,
    private toastService: ToastService,
    private accountService: AccountService
  ) {}

  toggleMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.isOpen) {
    }

    this.isOpen = !this.isOpen;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.id = changes['data'].currentValue.id;
      this.loadAccountStatus();
    }
  }

  loadAccountStatus() {
    if (this.type === CardType.MOVIE) {
      this.movieService
        .getMovieAccountStates(Number(this.id))
        .subscribe((res) => {
          this.accountStates = res;
        });
    } else {
      this.tvShowService
        .getTVShowAccountStates(Number(this.id))
        .subscribe((res) => {
          this.accountStates = res;
        });
    }
  }

  closeMenu() {
    this.isOpen = false;
  }

  handleMenuClick(event: MouseEvent, action: string) {
    event.preventDefault();
    event.stopPropagation();

    switch (action) {
      case 'addToList':
        break;
      case 'addToFavorite':
        this.handleToggleLikeBtn();

        break;
      case 'addToWatchlist':
        this.handleToggleAddBtn();
        break;
      case 'rateMovie':
        this.showRatingModal = true;
        break;
    }
    // this.loadAccountStatus();
  }
  handleToggleLikeBtn() {
    if (this.type === CardType.MOVIE) {
      this.accountService
        .markAsFavorite(
          'movie',
          Number(this?.id),
          !this.accountStates?.favorite
        )
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.favorite = !this.accountStates.favorite;
          }
        });
    } else {
      this.accountService
        .markAsFavorite('tv', Number(this?.id), !this.accountStates?.favorite)
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.favorite = !this.accountStates.favorite;
          }
        });
    }
  }

  handleToggleAddBtn() {
    if (this.type === CardType.MOVIE) {
      this.accountService
        .addToWatchlist(
          'movie',
          Number(this?.id),
          !this.accountStates?.watchlist
        )
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.watchlist = !this.accountStates.watchlist;
          }
        });
    } else {
      this.accountService
        .addToWatchlist('tv', Number(this?.id), !this.accountStates?.watchlist)
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.watchlist = !this.accountStates.watchlist;
          }
        });
    }
  }

  onRatingModalClose(): void {
    this.showRatingModal = false;
  }

  onRatingSubmit(rating: number): void {
    // this.accountStates = true;
  }

  onClearRating(): void {
    // this.accountStates = false;
    // TODO: Implement rating clear to API
  }

  getMovieTitle(): string {
    if (!this.data) return '';

    if (this.type === CardType.MOVIE) {
      return (this.data as Movie | MovieDetail).title || '';
    } else if (this.type === CardType.TV_SHOW) {
      return (this.data as TVShow).name || '';
    }

    return '';
  }

  // Đóng menu khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu')) {
      this.closeMenu();
    }
  }
}

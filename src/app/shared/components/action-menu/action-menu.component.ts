import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  Input,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { TVShow } from '@features/client/tv-shows/models/tv-show.model';
import { CardType } from '@core/utils/enums';
import { AccountStates } from '@core/models/account.model';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { ToastService } from '@core/services/toast.service';
import { AccountService } from '@core/services/account.service';
import { MovieService } from '@features/client/movies/services/movie.service';
import { Movie } from '@features/client/movies/models/movie.model';
import { AuthService } from '@core/services/auth.service';
import { RatingModalService } from '@core/services/rating-modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss'],
})
export class ActionMenuComponent implements OnInit, OnChanges {
  isOpen = false;
  @Input() type: CardType = CardType.MOVIE;
  @Input() data?: any = null;
  credential: any | null = null;

  id: number | null = null;

  showRatingModal: boolean = false;

  accountStates: AccountStates | null = null;

  constructor(
    private movieService: MovieService,
    private tvShowService: TVShowService,
    private toastService: ToastService,
    private accountService: AccountService,
    private authService: AuthService,
    private ratingModalService: RatingModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.credential = this.authService.getCredential();
  }
  toggleMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.isOpen = !this.isOpen;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && changes['data'].currentValue) {
      this.id = changes['data'].currentValue.id;
      this.loadAccountStatus();
    }
  }
  handleCloseRatingModal() {
    this.showRatingModal = false;
  }
  loadAccountStatus() {
    this.movieService
      .getMovieAccountStates(Number(this.id))
      .subscribe((res) => {
        this.accountStates = res;
      });
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
      // case 'addToWatchlist':
      //   this.handleToggleAddBtn();
      //   break;
      case 'rateMovie':
        this.handleRating();
        break;
    }
    this.closeMenu();
    this.loadAccountStatus();
  }
  handleToggleLikeBtn() {
    if (!this.credential || !this.credential.id) {
      alert('Please login to add this movie to your favorite');
      this.router.navigate(['/auth/login']);
      return;
    }
    if (!this.accountStates?.inFavourite) {
      this.accountService
        .addMovieToFavorite(Number(this?.id), Number(this.credential?.id))
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.inFavourite = !this.accountStates.inFavourite;
          }
        });
    } else {
      this.accountService
        .removeMovieFromFavorite(Number(this?.id))
        .subscribe((res) => {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.inFavourite = !this.accountStates.inFavourite;
          }
        });
    }
  }

  handleRating() {
    if (!this.credential || !this.credential.id) {
      alert('Please login to rate this movie');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.ratingModalService.open({
      movie: this.data as Movie,
      onClose: () => {
        this.loadAccountStatus();
      },
    });
  }

  // handleToggleAddBtn() {
  //   if (this.type === CardType.MOVIE) {
  //     this.accountService
  //       .addToWatchlist(
  //         'movie',
  //         Number(this?.id),
  //         !this.accountStates?.watchlist
  //       )
  //       .subscribe((res) => {
  //         this.toastService.success('Thao tác thành công!');
  //         if (this.accountStates) {
  //           this.accountStates.watchlist = !this.accountStates.watchlist;
  //         }
  //       });
  //   } else {
  //     this.accountService
  //       .addToWatchlist('tv', Number(this?.id), !this.accountStates?.watchlist)
  //       .subscribe((res) => {
  //         this.toastService.success('Thao tác thành công!');
  //         if (this.accountStates) {
  //           this.accountStates.watchlist = !this.accountStates.watchlist;
  //         }
  //       });
  //   }
  // }

  getMovieTitle(): string {
    if (!this.data) return '';

    if (this.type === CardType.MOVIE) {
      return (this.data as Movie | Movie).title || '';
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

import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { environment } from 'src/environments/environment';
import { TVShowService } from '@features/client/services/tv-shows.service';
import { TVShowDetail } from '@features/client/tv-shows/models/tv-show.model';
import { AccountService } from '@core/services/account.service';
import { ToastService } from '@core/services/toast.service';
import { AccountStates } from '@core/models/account.model';
import { TrailerItem } from '@features/client/movies/models/movie.model';

@Component({
  selector: 'app-tv-detail-hero',
  templateUrl: './tv-detail-hero.component.html',
  styleUrls: ['./tv-detail-hero.component.scss'],
})
export class TVShowDetailHeroComponent implements OnInit {
  imageBaseUrl = environment.imageBaseUrl;
  id: number | null = null;
  @Input() tvShow: TVShowDetail | null = null;
  age: string = '';
  openTrailerModal = false;
  trailer: TrailerItem | null = null;
  disablePlayTrailer = false;
  genres: string = '';

  accountStates: AccountStates | null = null;

  constructor(
    private tvShowService: TVShowService,
    private accountService: AccountService,
    private toastService: ToastService
  ) {}
  ngOnInit(): void {
    this.genres =
      this.tvShow?.genres.map((genre) => genre.name).join(', ') || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tvShow'] && changes['tvShow'].currentValue) {
      this.tvShow = changes['tvShow'].currentValue;
      this.genres =
        changes['tvShow'].currentValue.genres
          .map((genre: any) => genre.name)
          .join(', ') || '';
      this.age = changes['tvShow'].currentValue.adult ? 'R' : 'PG-13';
      this.id = changes['tvShow'].currentValue.id;
      this.loadTraier();
      this.loadTVShowStatus();
    }
  }

  handleToggleLikeBtn() {
    this.accountService
      .markAsFavorite(
        'tv',
        Number(this?.tvShow?.id),
        !this.accountStates?.favorite
      )
      .subscribe((res) => {
        if (res) {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.favorite = !this.accountStates.favorite;
          }
        }
      });
  }

  handleToggleAddBtn() {
    this.accountService
      .addToWatchlist(
        'tv',
        Number(this?.tvShow?.id),
        !this.accountStates?.watchlist
      )
      .subscribe((res) => {
        if (res) {
          this.toastService.success('Thao tác thành công!');
          if (this.accountStates) {
            this.accountStates.watchlist = !this.accountStates.watchlist;
          }
        }
      });
  }

  loadTVShowStatus() {
    this.tvShowService
      .getTVShowAccountStates(Number(this.id))
      .subscribe((res) => {
        this.accountStates = res;
      });
  }

  onPlayTrailer(): void {
    if (this.disablePlayTrailer && !this.trailer) {
      return;
    }
    this.openTrailerModal = true;
  }
  loadTraier() {
    this.tvShowService.getTVShowTrailer(this.id as number).subscribe((res) => {
      if (res === null) {
        this.disablePlayTrailer = true;
        return;
      }
      this.trailer = res;
    });
  }
  onCloseTrailerModal(): void {
    this.openTrailerModal = false;
  }
}

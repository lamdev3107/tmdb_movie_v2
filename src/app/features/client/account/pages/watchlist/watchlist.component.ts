import {
  ListFilm,
  ListFilmsService,
} from './../../services/list-films.service';
import { Component, OnInit } from '@angular/core';
import { AccountService } from '@core/services/account.service';
import { TabItem } from '@shared/components/tab/tab.component';
import { ChangeDetectorRef } from '@angular/core'; // Thêm dòng này ở đầu file
import { LoadingService } from '@core/services/loading.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
  listFilms: ListFilm[] = [];
  isOpenListFormModal = false;
  credential: any | null = null;
  editingListFilm: ListFilm | null = null;
  constructor(
    private ListFilmsService: ListFilmsService,
    public loadingService: LoadingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.credential = this.authService.getCredential();
    this.loadListFilms();
  }

  handleAddList() {
    this.isOpenListFormModal = true;
  }

  handleEditList(listFilm: ListFilm) {
    this.editingListFilm = listFilm;
    this.isOpenListFormModal = true;
  }

  handleDeleteList(listFilm: ListFilm) {
    if (confirm('Are you sure you want to delete this list?')) {
      this.ListFilmsService.deleteListFilm(Number(listFilm.id)).subscribe({
        next: () => {
          this.loadListFilms();
        },
      });
    }
  }

  handleCloseModal() {
    this.isOpenListFormModal = false;
    this.editingListFilm = null;
  }

  loadListFilms() {
    this.loadingService.show();

    this.ListFilmsService.getListFilmsOfUser(this.credential.id).subscribe({
      next: (res) => {
        this.listFilms = res.data;
        console.log('chekc ress', res);
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
      },
    });
  }
}

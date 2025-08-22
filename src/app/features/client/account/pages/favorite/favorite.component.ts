import { Component, OnInit } from '@angular/core';
import { AccountService } from '@core/services/account.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
})
export class FavoriteComponent implements OnInit {
  credential: any | null = null;
  favoriteMovies?: any[] = [];
  isLoading = false;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.credential = this.authService.getCredential();
    this.loadFavoriteMovies();
  }
  loadFavoriteMovies() {
    this.isLoading = true;
    this.accountService.getFavoriteMovies().subscribe({
      next: (res) => {
        this.favoriteMovies = res.results;
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  handleRemoveFromFavorite() {
    this.loadFavoriteMovies();
  }
}

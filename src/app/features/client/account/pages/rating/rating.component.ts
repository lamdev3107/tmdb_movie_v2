import { Component, OnInit } from '@angular/core';
import { AccountService } from '@core/services/account.service';
import { AuthService } from '@core/services/auth.service';
import { RatingService } from '@core/services/rating.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {
  credential: any | null = null;
  ratedMovies?: any[] = [];
  isLoading = false;

  constructor(
    private ratingService: RatingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.credential = this.authService.getCredential();
    this.loadRatedMovies();
  }
  loadRatedMovies() {
    this.isLoading = true;
    this.ratingService.getRatedListOfUser(this.credential.id).subscribe({
      next: (res) => {
        console.log('Check ', res);
        this.ratedMovies = res.results;
        console.log('check favoriteMovies', this.ratedMovies);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
  handleRemoveFromRating() {
    this.loadRatedMovies();
  }
}

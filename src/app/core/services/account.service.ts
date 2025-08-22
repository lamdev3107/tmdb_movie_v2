import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Account } from '@core/models/account.model';
import { environment } from '@environments/environment';
import { SuccessResponse } from '@core/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = environment.backendUrl + 'users';
  private accountId = 21966283;
  constructor(private http: HttpClient) {}

  getAccountDetails(id: number): Observable<Account> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  addMovieToFavorite(movieId: number, userId: number): Observable<any> {
    const body = {
      movieId: movieId,
      userId: userId,
    };

    return this.http.post(`${this.baseUrl}/favourite-films`, body, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getFavoriteMovies(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http
      .get(`${this.baseUrl}/favourite-films`, {
        params,
      })
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  removeMovieFromFavorite(movieId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/favourite-films/${movieId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  getRatedMovies(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(`${this.baseUrl}/${this.accountId}/rated/movies`, {
      params,
    });
  }

  getRatedTV(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(`${this.baseUrl}/${this.accountId}/rated/tv`, {
      params,
    });
  }

  getRatedTVEpisodes(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(
      `${this.baseUrl}/${this.accountId}/rated/tv/episodes`,
      {
        params,
      }
    );
  }

  getLists(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(`${this.baseUrl}/${this.accountId}/lists`, { params });
  }
}

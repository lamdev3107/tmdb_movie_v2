import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '@core/models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = 'account';
  private accountId = 21966283;
  constructor(private http: HttpClient) {}

  getAccountDetails(): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${this.accountId}`);
  }

  markAsFavorite(
    mediaType: 'movie' | 'tv',
    mediaId: number,
    favorite: boolean
  ): Observable<any> {
    const params = new HttpParams();

    const body = {
      media_type: mediaType,
      media_id: mediaId,
      favorite: favorite,
    };

    return this.http.post(`${this.baseUrl}/${this.accountId}/favorite`, body, {
      params,
    });
  }

  getFavoriteMovies(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(`${this.baseUrl}/${this.accountId}/favorite/movies`, {
      params,
    });
  }

  getFavoriteTV(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(`${this.baseUrl}/${this.accountId}/favorite/tv`, {
      params,
    });
  }

  addToWatchlist(
    mediaType: 'movie' | 'tv',
    mediaId: number,
    watchlist: boolean
  ): Observable<any> {
    const params = new HttpParams();

    const body = {
      media_type: mediaType,
      media_id: mediaId,
      watchlist: watchlist,
    };

    return this.http.post(`${this.baseUrl}/${this.accountId}/watchlist`, body, {
      params,
    });
  }

  getWatchlistMovies(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(`${this.baseUrl}/${this.accountId}/watchlist/movies`, {
      params,
    });
  }

  getWatchlistTV(page: number = 1): Observable<any> {
    const params = new HttpParams().set('page', page);

    return this.http.get(`${this.baseUrl}/${this.accountId}/watchlist/tv`, {
      params,
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Genre,
  GenreListResponse,
  GenreResponseData,
} from '../models/genre.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private baseUrl = environment.apiUrl + 'genre';
  private backendUrl = environment.backendUrl + 'genres';

  constructor(private http: HttpClient) {}
  getGenres(
    page: number = 1,
    size: number = 30,
    keyword: string = ''
  ): Observable<GenreResponseData> {
    return this.http
      .get<GenreResponseData>(
        `${this.backendUrl}?page=${page}&size=${size}&keyword=${keyword}`
      )
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }

  createGenre(genre: string): Observable<any> {
    return this.http.post<any>(`${this.backendUrl}/create`, genre, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  updateGenre(genre: any): Observable<any> {
    return this.http.put<any>(`${this.backendUrl}`, genre, {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  deleteGenre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.backendUrl}/${id}`);
  }

  getGenre(id: number): Observable<any> {
    return this.http.get<any>(`${this.backendUrl}/${id}`);
  }

  getMovieGenreList(): Observable<GenreListResponse> {
    return this.http.get<GenreListResponse>(`${this.baseUrl}/movie/list`);
  }
  getTVGenreList(): Observable<GenreListResponse> {
    return this.http.get<GenreListResponse>(`${this.baseUrl}/tv/list`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenreListResponse } from '../models/genre.model';

@Injectable({
  providedIn: 'root',
})
export class GenreService {
  private baseUrl = 'genre';

  constructor(private http: HttpClient) {}

  getMovieGenreList(): Observable<GenreListResponse> {
    return this.http.get<GenreListResponse>(`${this.baseUrl}/movie/list`);
  }
  getTVGenreList(): Observable<GenreListResponse> {
    return this.http.get<GenreListResponse>(`${this.baseUrl}/tv/list`);
  }
}

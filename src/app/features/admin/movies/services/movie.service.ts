import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { MovieBody, MovieResponseData } from '../models/movie.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private baseUrl = environment.backendUrl + 'movies';
  constructor(private http: HttpClient) {}

  getMovie(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createMovie(formData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, formData);
  }

  updateMovie(Movie: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}`, Movie);
  }
  getMovies(
    page: number = 1,
    size: number = 30,
    keyword: string = ''
  ): Observable<MovieResponseData[]> {
    return this.http
      .get<MovieResponseData[]>(
        `${this.baseUrl}/searchByTitle?page=${page}&size=${size}&keyword=${keyword}`
      )
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }
  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

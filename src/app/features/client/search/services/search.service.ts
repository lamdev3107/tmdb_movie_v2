import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
} from 'rxjs';
import { SearchResponse } from '../models/search.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    // Khi search thay đổi → trigger search keyword API
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((query) => query.trim().length > 0)
      )
      .subscribe((query) => {
        this.searchMulti(query).subscribe();
        this.searchMovie(query).subscribe();
        this.searchTV(query).subscribe();
        this.searchPerson(query).subscribe();
      });
  }

  searchMulti(query: string, page: number = 1): Observable<SearchResponse> {
    return this.http
      .get<SearchResponse>(`${this.baseUrl}search/multi`, {
        params: {
          query,
          page,
        },
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  searchMovie(query: string, page: number = 1): Observable<SearchResponse> {
    return this.http
      .get<SearchResponse>(`${this.baseUrl}search/movie`, {
        params: {
          query,
          page,
        },
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  searchTV(query: string, page: number = 1): Observable<SearchResponse> {
    return this.http
      .get<SearchResponse>(`${this.baseUrl}search/tv`, {
        params: {
          query,
          page,
        },
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  searchPerson(query: string, page: number = 1): Observable<SearchResponse> {
    return this.http
      .get<SearchResponse>(`${this.baseUrl}search/person`, {
        params: {
          query,
          page,
        },
      })
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}

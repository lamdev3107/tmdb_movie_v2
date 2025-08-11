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

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');

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
      .get<SearchResponse>(`search/multi`, {
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
      .get<SearchResponse>(`search/movie`, {
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
      .get<SearchResponse>(`search/tv`, {
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
      .get<SearchResponse>(`search/person`, {
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

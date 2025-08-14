import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  map,
} from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class KeywordService {
  private searchSubject = new BehaviorSubject<string>('');
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {
    // Khi search thay đổi → trigger search keyword API
    this.searchSubject
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        filter((query) => query.trim().length > 0)
      )
      .subscribe((query) => {
        this.searchKeyword(query).subscribe();
      });
  }

  searchKeyword(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}search/keyword`, {
      params: {
        query,
      },
    });
  }
}

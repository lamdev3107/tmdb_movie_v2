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

@Injectable({ providedIn: 'root' })
export class KeywordService {
  private searchSubject = new BehaviorSubject<string>('');

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
    return this.http.get(`search/keyword`, {
      params: {
        query,
      },
    });
  }
}

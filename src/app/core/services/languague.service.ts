import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Language, LanguageResponseData } from '@core/models/language.model';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private baseUrl = environment.backendUrl + 'languages';
  constructor(private http: HttpClient) {}

  getLanguages(
    page: number = 1,
    size: number = 30,
    keyword: string = ''
  ): Observable<Language[]> {
    const url = `${this.baseUrl}?page=${page}&size=${size}&keyword=${keyword}`;
    return this.http.get<LanguageResponseData>(url).pipe(
      map((res: any) => {
        return res.data.results;
      })
    );
  }
}

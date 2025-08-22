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
  ): Observable<LanguageResponseData> {
    return this.http
      .get<LanguageResponseData>(
        `${this.baseUrl}?page=${page}&size=${size}&keyword=${keyword}`
      )
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }
  createLanguage(language: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, language, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  updateLanguage(language: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}`, language, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  deleteLanguage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getLanguage(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}

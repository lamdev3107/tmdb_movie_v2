import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}
export interface Language {
  english_name: string;
  iso_639_1: string;
  name: string;
}
@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  private baseUrl = 'configuration';
  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    const url = `${this.baseUrl}/countries`;
    return this.http.get<Country[]>(url);
  }

  getLanguages(): Observable<Language[]> {
    const url = `${this.baseUrl}/languages`;
    return this.http.get<Language[]>(url);
  }
}

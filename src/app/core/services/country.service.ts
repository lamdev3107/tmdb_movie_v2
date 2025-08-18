import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country, CountryResponseData } from '@core/models/country.model';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private baseUrl = environment.backendUrl + 'countries';
  constructor(private http: HttpClient) {}

  getCountries(
    page: number = 1,
    size: number = 30,
    keyword: string = ''
  ): Observable<Country[]> {
    const url = `${this.baseUrl}?page=${page}&size=${size}&keyword=${keyword}`;
    return this.http.get<CountryResponseData>(url).pipe(
      map((res: any) => {
        return res.data.results;
      })
    );
  }
}

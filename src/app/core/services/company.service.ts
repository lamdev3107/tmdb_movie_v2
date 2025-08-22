import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { CompanyResponseData } from '@core/models/company.model';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private baseUrl = environment.backendUrl + 'companies';

  constructor(private http: HttpClient) {}
  getCompanies(
    page: number = 1,
    size: number = 30,
    keyword: string = ''
  ): Observable<CompanyResponseData> {
    return this.http
      .get<CompanyResponseData>(
        `${this.baseUrl}?page=${page}&size=${size}&keyword=${keyword}`
      )
      .pipe(
        map((res: any) => {
          return res.data;
        })
      );
  }
  createCompany(company: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, company);
  }

  updateCompany(company: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}`, company, {});
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getCompany(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }
}

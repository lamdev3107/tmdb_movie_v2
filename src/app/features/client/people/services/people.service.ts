import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map, Observable, switchMap } from 'rxjs';
import {
  combinedCreditResponse,
  PeopleResponse,
  PersonDetail,
} from '../models/person.model';
import { environment } from '@environments/environment';
import { AdminPeopleResponseData } from '@features/admin/people/models/admin-person.model';

export interface queryListMovie {
  language: string;
  page: number;
  region: string;
}
@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private baseUrl = environment.backendUrl + 'persons';
  constructor(private http: HttpClient) {}

  getPeople(
    page: number = 1,
    size: number = 10,
    keyword: string = '',
    career: string = 'casting'
  ): Observable<AdminPeopleResponseData> {
    return this.http
      .get<any>(
        `${this.baseUrl}/search?page=${page}&size=${size}&keyword=${keyword}`
      )
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  getPopularPeople(
    page: number = 1,
    language: string = 'en-US'
  ): Observable<PeopleResponse> {
    let params = new HttpParams();
    params = params.set('page', page);

    return this.http.get<PeopleResponse>(`${this.baseUrl}/popular`, {
      params: params,
    });
  }

  getPersonDetail(
    personId: number,
    language: string = 'en-US'
  ): Observable<PersonDetail> {
    return this.http.get<PersonDetail>(`${this.baseUrl}/${personId}`, {
      params: {
        language,
      },
    });
  }

  getPersonCombinedCredit(
    personId: number,
    language: string = 'en-US'
  ): Observable<any> {
    return this.http
      .get<combinedCreditResponse>(
        `${this.baseUrl}/${personId}/combined_credits`,
        {
          params: {
            language,
          },
        }
      )
      .pipe(
        map((res: any) => {
          return {
            cast: res.cast,
            crew: res.crew,
          };
        })
      );
  }

  getKnownFor(personId: number, language: string = 'en-US'): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/${personId}/combined_credits`, {
        params: { language },
      })
      .pipe(
        map((res) => {
          return {
            cast: res.cast.slice(0, 10),
            crew: res.crew.slice(0, 10),
          };
        })
      );
  }
}

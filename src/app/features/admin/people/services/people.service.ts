import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import {
  AdminPerson,
  AdminPeopleResponseData,
} from '../models/admin-person.model';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PeopleService {
  private baseUrl = environment.backendUrl + 'persons';
  constructor(private http: HttpClient) {}

  getPeople(
    page: number = 1,
    size: number = 10,
    keyword: string = ''
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

  getPerson(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  createPerson(person: any): Observable<AdminPerson> {
    return this.http.post<AdminPerson>(`${this.baseUrl}/create`, person);
  }

  updatePerson(id: number, person: any): Observable<AdminPerson> {
    // Bổ sung type: formdata
    return this.http.put<AdminPerson>(`${this.baseUrl}`, person, {
      // headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  deletePerson(id: number): Observable<void> {
    console.log('check id', id);
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

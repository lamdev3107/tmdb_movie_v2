import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
export interface SuccessResponse<T> {
  statusCode: number;
  error: string | null;
  message: string;
  data: T;
}

export interface ListFilm {
  id?: number;
  userId: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}
@Injectable({
  providedIn: 'root',
})
export class ListFilmsService {
  private baseUrl = environment.backendUrl + 'users/list-films';

  constructor(private http: HttpClient) {}

  getListFilmsOfUser(userId: number): Observable<SuccessResponse<ListFilm[]>> {
    return this.http.get<SuccessResponse<ListFilm[]>>(
      `${this.baseUrl}/${userId}`
    );
  }
  createListFilm(listFilm: ListFilm): Observable<SuccessResponse<ListFilm>> {
    return this.http.post<SuccessResponse<ListFilm>>(
      `${this.baseUrl}`,
      listFilm,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  updateListFilm(
    id: number,
    listFilm: ListFilm
  ): Observable<SuccessResponse<any>> {
    return this.http.put<SuccessResponse<any>>(
      `${this.baseUrl}/${id}`,
      listFilm
    );
  }
  deleteListFilm(id: number): Observable<SuccessResponse<void>> {
    return this.http.delete<SuccessResponse<void>>(`${this.baseUrl}/${id}`);
  }
  addMovieToList(
    listId: number,
    movieId: number
  ): Observable<SuccessResponse<void>> {
    return this.http.post<SuccessResponse<void>>(
      `${this.baseUrl}/${listId}/${movieId}`,
      {}
    );
  }
  removeMovieFromList(
    listId: number,
    movieId: number
  ): Observable<SuccessResponse<void>> {
    return this.http.delete<SuccessResponse<void>>(
      `${this.baseUrl}/${listId}/${movieId}`
    );
  }
}

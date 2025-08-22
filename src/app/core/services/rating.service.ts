import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RatingService {
  private baseUrl = environment.backendUrl + 'ratings';

  constructor(private http: HttpClient) {}

  createRating(
    userId: number,
    movieId: number,
    rating: number
  ): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}`,
      {
        userId,
        movieId,
        score: rating,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  getRatedListOfUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/users/${userId}`).pipe(
      map((res: any) => {
        return res.data;
      })
    );
  }

  getMovieRating(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${movieId}`).pipe(
      map((res: any) => {
        console.log('check res', res);
        return res.data;
      })
    );
  }

  deleteRating(userId: number, movieId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/${movieId}`);
  }
}

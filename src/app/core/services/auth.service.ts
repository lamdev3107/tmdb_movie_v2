import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { LoginResquest, SuccessResponse } from '@core/models/auth.model';
import { environment } from '@environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.backendUrl;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  login(credentials: LoginResquest): Observable<SuccessResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<SuccessResponse>(
      `${this.apiUrl}/auth/login`,
      JSON.stringify(credentials),
      httpOptions
    );
  }
  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

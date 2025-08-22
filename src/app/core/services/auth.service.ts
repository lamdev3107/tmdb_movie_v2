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
  private credentialSubject = new BehaviorSubject<any | null>(null);

  setCredential(credential: any): void {
    localStorage.setItem('credential', JSON.stringify(credential));
    this.credentialSubject.next(credential);
  }

  get credential$(): Observable<any | null> {
    return this.credentialSubject.asObservable();
  }

  constructor(private http: HttpClient) {}

  login(credentials: LoginResquest): Observable<SuccessResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };
    return this.http.post<SuccessResponse>(
      `${this.apiUrl}auth/login`,
      JSON.stringify(credentials),
      httpOptions
    );
  }
  logout(): Observable<string> {
    const httpOptions = {
      withCredentials: true,
    };
    return this.http.post<string>(`${this.apiUrl}auth/logout`, httpOptions);
  }

  register(credentials: LoginResquest): Observable<SuccessResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };
    return this.http.post<SuccessResponse>(
      `${this.apiUrl}auth/register`,
      JSON.stringify(credentials),
      httpOptions
    );
  }

  getUserInfo(): Observable<SuccessResponse> {
    const httpOptions = {
      withCredentials: true,
    };
    return this.http.get<SuccessResponse>(
      `${this.apiUrl}auth/account`,
      httpOptions
    );
  }

  clearToken(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }
  clearCredential(): void {
    localStorage.removeItem('credential');
    this.credentialSubject.next(null);
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

  getCredential(): any | null {
    return JSON.parse(localStorage.getItem('credential') || '{}');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiError } from '../models';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected readonly baseUrl = 'http://localhost:8080/api';

  constructor(protected http: HttpClient) {}

  protected handleError(error: HttpErrorResponse): Observable<never> {
    let apiError: ApiError;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      apiError = {
        message: 'Erro de conexão com o servidor',
        status: 0,
        timestamp: new Date().toISOString(),
        path: error.url || '',
        details: [error.error.message]
      };
    } else {
      // Server-side error
      apiError = error.error || {
        message: error.message || 'Erro interno do servidor',
        status: error.status,
        timestamp: new Date().toISOString(),
        path: error.url || ''
      };
    }

    return throwError(() => apiError);
  }

  protected get<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, body)
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, body)
      .pipe(catchError(this.handleError.bind(this)));
  }

  protected delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`)
      .pipe(catchError(this.handleError.bind(this)));
  }
} 
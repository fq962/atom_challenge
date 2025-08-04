import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  UserResponse,
  CreateUserRequest,
  CreateUserResponse,
} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  // private readonly API_URL = 'https://atom-challenge-api.fly.dev/api/users';
  private readonly API_URL = 'http://localhost:3000/api/users';

  constructor() {}

  // Obtener información de usuario por email
  getUserByEmail(email: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}/${email}`).pipe(
      catchError((error) => {
        console.error('Error al obtener el usuario:', error);
        return throwError(() => error);
      })
    );
  }

  // Crear nuevo usuario
  createUser(userData: CreateUserRequest): Observable<CreateUserResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<CreateUserResponse>(this.API_URL, userData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al crear el usuario:', error);
          return throwError(() => error);
        })
      );
  }
}

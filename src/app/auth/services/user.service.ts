import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserResponse } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
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
}

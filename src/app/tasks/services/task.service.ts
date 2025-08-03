import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  Task,
  TaskResponse,
  // CreateTaskRequest,
  UpdateTaskRequest,
  CreateTaskResponse,
  UpdateTaskResponse,
  GetAllTasksResponse,
  ICreateTaskRequest,
  ITaskResponse,
  DeleteTaskRequest,
  DeleteTaskResponse,
  UpdateTaskRequestNew,
} from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://atom-challenge-api.fly.dev/api/tasks';

  constructor() {}

  // Obtener todas las tareas desde la API
  getAllTasks(): Observable<GetAllTasksResponse> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<GetAllTasksResponse>(this.API_URL, { headers }).pipe(
      catchError((error) => {
        console.error('Error al obtener las tareas:', error);
        return throwError(() => error);
      })
    );
  }

  // Crear nueva tarea
  createTask(taskData: ICreateTaskRequest): Observable<ITaskResponse> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<ITaskResponse>(this.API_URL, taskData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al crear la tarea:', error);
          return throwError(() => error);
        })
      );
  }

  // Eliminar tarea
  deleteTask(taskData: DeleteTaskRequest): Observable<DeleteTaskResponse> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .delete<DeleteTaskResponse>(this.API_URL, {
        body: taskData,
        headers,
      })
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar la tarea:', error);
          return throwError(() => error);
        })
      );
  }

  // Actualizar tarea
  updateTask(taskData: UpdateTaskRequestNew): Observable<ITaskResponse> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .patch<ITaskResponse>(this.API_URL, taskData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar la tarea:', error);
          return throwError(() => error);
        })
      );
  }
}

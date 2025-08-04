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
  ITaskRepository,
} from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements ITaskRepository {
  /**
   * Cliente HTTP de Angular para peticiones a la API.
   * @private
   */
  private http = inject(HttpClient);

  /**
   * URL base de la API de tareas.
   * @private
   * @readonly
   */
  // private readonly API_URL = 'https://atom-challenge-api.fly.dev/api/tasks';
  private readonly API_URL = 'http://localhost:3000/api/tasks';

  constructor() {}

  // === MÉTODOS PÚBLICOS ===

  /**
   * Obtiene todas las tareas del usuario autenticado.
   *
   * @description
   * Realiza petición GET con token de autorización.
   *
   * @returns Observable con respuesta de la API
   */
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

  /**
   * Crea una nueva tarea.
   *
   * @description
   * Realiza petición POST con datos de la tarea.
   *
   * @param taskData - Datos de la tarea a crear
   * @returns Observable con la tarea creada
   */
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

  /**
   * Elimina una tarea existente.
   *
   * @description
   * Realiza petición DELETE con ID de la tarea.
   *
   * @param taskData - Datos con ID de la tarea
   * @returns Observable con confirmación de eliminación
   */
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

  /**
   * Actualiza una tarea existente.
   *
   * @description
   * Realiza petición PATCH con datos parciales de actualización.
   *
   * @param taskData - Datos de actualización con ID
   * @returns Observable con la tarea actualizada
   */
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

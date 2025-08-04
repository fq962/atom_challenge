import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { TaskService } from './task.service';
import { TaskDataTransformerService } from '../../shared/services/task-data-transformer.service';
import {
  Task,
  ICreateTaskRequest,
  UpdateTaskRequestNew,
  DeleteTaskRequest,
  ITaskRepository,
} from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskFacadeService {
  /**
   * Repositorio de tareas para operaciones HTTP.
   * @private
   */
  private taskRepository: ITaskRepository = inject(TaskService);

  /**
   * Servicio de transformación de datos API ↔ Local.
   * @private
   */
  private dataTransformer = inject(TaskDataTransformerService);

  // === MÉTODOS PÚBLICOS ===

  /**
   * Obtiene todas las tareas transformadas al formato local.
   *
   * @description
   * Coordina la obtención desde API y transformación a formato local.
   * Maneja errores con mensajes amigables al usuario.
   *
   * @returns Observable<Task[]> - Tareas en formato local
   */
  getAllTasks(): Observable<Task[]> {
    return this.taskRepository.getAllTasks().pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al obtener las tareas');
        }
        return this.dataTransformer.transformApiTasksToLocal(response.data);
      }),
      catchError((error) => {
        console.error('Error en TaskFacade.getAllTasks:', error);
        return throwError(() => new Error('No se pudieron cargar las tareas'));
      })
    );
  }

  /**
   * Crea una nueva tarea y la devuelve transformada.
   *
   * @description
   * Envía datos a la API y transforma la respuesta al formato local.
   *
   * @param taskData - Datos de la nueva tarea
   * @returns Observable<Task> - Tarea creada en formato local
   */
  createTask(taskData: ICreateTaskRequest): Observable<Task> {
    return this.taskRepository.createTask(taskData).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al crear la tarea');
        }
        return this.dataTransformer.transformApiTaskToLocal(response.data);
      }),
      catchError((error) => {
        console.error('Error en TaskFacade.createTask:', error);
        return throwError(() => new Error('No se pudo crear la tarea'));
      })
    );
  }

  /**
   * Actualiza una tarea existente y la devuelve transformada.
   *
   * @description
   * Aplica actualizaciones parciales y transforma la respuesta.
   *
   * @param taskData - Datos de actualización con ID
   * @returns Observable<Task> - Tarea actualizada en formato local
   */
  updateTask(taskData: UpdateTaskRequestNew): Observable<Task> {
    return this.taskRepository.updateTask(taskData).pipe(
      map((response) => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al actualizar la tarea');
        }
        return this.dataTransformer.transformApiTaskToLocal(response.data);
      }),
      catchError((error) => {
        console.error('Error en TaskFacade.updateTask:', error);
        return throwError(() => new Error('No se pudo actualizar la tarea'));
      })
    );
  }

  /**
   * Elimina una tarea por su ID.
   *
   * @description
   * Construye la petición de eliminación y maneja la respuesta.
   *
   * @param taskId - ID único de la tarea a eliminar
   * @returns Observable<void> - Confirmación de eliminación
   */
  deleteTask(taskId: string): Observable<void> {
    const deleteRequest: DeleteTaskRequest = { id: taskId };

    return this.taskRepository.deleteTask(deleteRequest).pipe(
      map((response) => {
        if (!response.success) {
          throw new Error(response.message || 'Error al eliminar la tarea');
        }
        // No necesitamos devolver datos para delete
        return void 0;
      }),
      catchError((error) => {
        console.error('Error en TaskFacade.deleteTask:', error);
        return throwError(() => new Error('No se pudo eliminar la tarea'));
      })
    );
  }

  /**
   * Alterna el estado de completado de una tarea.
   *
   * @description
   * Método de conveniencia que invierte el estado is_done de una tarea.
   *
   * @param taskId - ID de la tarea
   * @param currentStatus - Estado actual (se invertirá)
   * @returns Observable<Task> - Tarea con estado actualizado
   */
  toggleTaskStatus(taskId: string, currentStatus: boolean): Observable<Task> {
    const updateRequest: UpdateTaskRequestNew = {
      id: taskId,
      is_done: !currentStatus,
    };

    return this.updateTask(updateRequest);
  }
}

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

/**
 * Facade que encapsula todas las operaciones de tareas
 * Simplifica la interacción del componente con los servicios
 * Aplica el patrón Facade para ocultar la complejidad de las operaciones
 */
@Injectable({
  providedIn: 'root',
})
export class TaskFacadeService {
  private taskRepository: ITaskRepository = inject(TaskService);
  private dataTransformer = inject(TaskDataTransformerService);

  /**
   * Obtiene todas las tareas transformadas al formato local
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
   * Crea una nueva tarea y la devuelve transformada
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
   * Actualiza una tarea existente y la devuelve transformada
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
   * Elimina una tarea por su ID
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
   * Alterna el estado de completado de una tarea
   */
  toggleTaskStatus(taskId: string, currentStatus: boolean): Observable<Task> {
    const updateRequest: UpdateTaskRequestNew = {
      id: taskId,
      is_done: !currentStatus,
    };

    return this.updateTask(updateRequest);
  }
}

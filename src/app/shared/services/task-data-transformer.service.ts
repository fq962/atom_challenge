import { Injectable } from '@angular/core';
import { ITaskDataTransformer, Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskDataTransformerService implements ITaskDataTransformer {
  /**
   * Transforma un array de tareas desde la API al formato local
   */
  transformApiTasksToLocal(tasks: any[]): Task[] {
    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks.map((task) => this.transformApiTaskToLocal(task));
  }

  /**
   * Transforma una tarea individual desde la API al formato local
   */
  transformApiTaskToLocal(task: any): Task {
    if (!task) {
      throw new Error('Task data cannot be null or undefined');
    }

    return {
      id: task.id,
      title: task.title || '',
      description: task.description || '',
      is_done: Boolean(task.is_done),
      priority: this.validatePriority(task.priority),
      created_at: this.parseDate(task.created_at),
    };
  }

  /**
   * Valida y normaliza el valor de prioridad
   */
  private validatePriority(priority: any): number {
    const numPriority = Number(priority);

    if (isNaN(numPriority) || numPriority < 1 || numPriority > 3) {
      console.warn(
        `Invalid priority value: ${priority}. Using default priority 2.`
      );
      return 2; // Prioridad media por defecto
    }

    return numPriority;
  }

  /**
   * Parsea y valida fechas desde la API
   */
  private parseDate(dateValue: any): Date {
    if (!dateValue) {
      return new Date();
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
      console.warn(`Invalid date value: ${dateValue}. Using current date.`);
      return new Date();
    }

    return date;
  }
}

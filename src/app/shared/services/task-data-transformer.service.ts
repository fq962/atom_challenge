import { Injectable } from '@angular/core';
import { ITaskDataTransformer, Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskDataTransformerService implements ITaskDataTransformer {
  // === MÉTODOS PÚBLICOS ===

  /**
   * Transforma un array de tareas desde formato API al formato local.
   *
   * @description
   * Procesa una colección de tareas de la API aplicando transformaciones
   * individuales a cada elemento y manejando casos edge como arrays nulos.
   *
   * @param tasks - Array de tareas desde la API
   * @returns Array de tareas en formato local
   *
   * @example
   * ```typescript
   * const apiTasks = [
   *   { id: "1", title: "Tarea 1", priority: "2" },
   *   { id: "2", title: "Tarea 2", priority: "invalid" }
   * ];
   * const localTasks = transformer.transformApiTasksToLocal(apiTasks);
   * // Resultado: Array<Task> con datos normalizados
   * ```
   */
  transformApiTasksToLocal(tasks: any[]): Task[] {
    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks.map((task) => this.transformApiTaskToLocal(task));
  }

  /**
   * Transforma una tarea individual desde formato API al formato local.
   *
   * @description
   * Convierte una tarea de API a formato local aplicando validaciones,
   * normalizaciones y valores por defecto para campos faltantes o inválidos.
   *
   * @param task - Tarea individual desde la API
   * @returns Tarea en formato local normalizada
   *
   * @throws {Error} Si la tarea es null o undefined
   *
   * @example
   * ```typescript
   * const apiTask = {
   *   id: "123",
   *   title: "Mi tarea",
   *   priority: "3",
   *   created_at: "2024-01-15T10:30:00Z"
   * };
   * const localTask = transformer.transformApiTaskToLocal(apiTask);
   * // Resultado: Task con tipos correctos y validaciones aplicadas
   * ```
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

  // === MÉTODOS PRIVADOS ===

  /**
   * Valida y normaliza el valor de prioridad de una tarea.
   *
   * @description
   * Convierte el valor de prioridad a número y valida que esté
   * dentro del rango permitido (1-3). Aplica valor por defecto
   * si el valor es inválido.
   *
   * @param priority - Valor de prioridad desde la API
   * @returns Número de prioridad válido (1, 2 o 3)
   *
   * @private
   * @example
   * ```typescript
   * this.validatePriority("2")    // → 2
   * this.validatePriority("high") // → 2 (por defecto + warning)
   * this.validatePriority(null)   // → 2 (por defecto + warning)
   * ```
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
   * Parsea y valida fechas desde la API.
   *
   * @description
   * Convierte valores de fecha de la API a objetos Date válidos.
   * Maneja casos de fechas inválidas o nulas aplicando fecha actual
   * como valor por defecto.
   *
   * @param dateValue - Valor de fecha desde la API
   * @returns Objeto Date válido
   *
   * @private
   * @example
   * ```typescript
   * this.parseDate("2024-01-15T10:30:00Z") // → Date object
   * this.parseDate("invalid-date")         // → new Date() + warning
   * this.parseDate(null)                   // → new Date()
   * ```
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

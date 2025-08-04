import { Injectable } from '@angular/core';
import { IPriorityStrategy, TaskPriority } from '../models/task.model';

// Implementación concreta de la estrategia de prioridades
@Injectable({
  providedIn: 'root',
})
export class DefaultPriorityStrategy implements IPriorityStrategy {
  private readonly priorityConfig = {
    [TaskPriority.LOW]: {
      class: 'bg-green-100 text-green-800',
      dotClass: 'bg-green-500',
      label: 'Baja',
    },
    [TaskPriority.MEDIUM]: {
      class: 'bg-yellow-100 text-yellow-800',
      dotClass: 'bg-amber-500',
      label: 'Media',
    },
    [TaskPriority.HIGH]: {
      class: 'bg-red-100 text-red-800',
      dotClass: 'bg-red-500',
      label: 'Alta',
    },
  };

  getPriorityClass(priority: number): string {
    return (
      this.priorityConfig[priority as TaskPriority]?.class ||
      this.priorityConfig[TaskPriority.MEDIUM].class
    );
  }

  getPriorityDotClass(priority: number): string {
    return (
      this.priorityConfig[priority as TaskPriority]?.dotClass ||
      this.priorityConfig[TaskPriority.MEDIUM].dotClass
    );
  }

  getPriorityLabel(priority: number): string {
    return (
      this.priorityConfig[priority as TaskPriority]?.label ||
      this.priorityConfig[TaskPriority.MEDIUM].label
    );
  }
}

// Factory para crear estrategias (permite extensión sin modificación)
@Injectable({
  providedIn: 'root',
})
export class PriorityStrategyFactory {
  createStrategy(type: 'default' | 'custom' = 'default'): IPriorityStrategy {
    switch (type) {
      case 'default':
        return new DefaultPriorityStrategy();
      // Aquí se pueden agregar nuevas estrategias sin modificar el código existente
      default:
        return new DefaultPriorityStrategy();
    }
  }
}

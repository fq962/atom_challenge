import { Injectable } from '@angular/core';
import { IPriorityStrategy, TaskPriority } from '../models/task.model';

// Implementación concreta de la estrategia de prioridades
@Injectable({
  providedIn: 'root',
})
export class DefaultPriorityStrategy implements IPriorityStrategy {
  /**
   * Configuración de estilos y etiquetas por nivel de prioridad.
   *
   * @description
   * Mapeo que define los estilos CSS, clases de indicadores y etiquetas
   * para cada nivel de prioridad utilizando Tailwind CSS.
   *
   * @private
   * @readonly
   */
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

  // === MÉTODOS PÚBLICOS ===

  /**
   * Obtiene las clases CSS para el contenedor de prioridad.
   *
   * @description
   * Retorna las clases CSS de Tailwind para estilizar badges o contenedores
   * de prioridad. Incluye fallback a prioridad media para valores inválidos.
   *
   * @param priority - Nivel de prioridad numérico (1, 2 o 3)
   * @returns String con clases CSS de Tailwind
   *
   * @example
   * ```typescript
   * strategy.getPriorityClass(TaskPriority.HIGH)   // → "bg-red-100 text-red-800"
   * strategy.getPriorityClass(TaskPriority.LOW)    // → "bg-green-100 text-green-800"
   * strategy.getPriorityClass(99)                  // → "bg-yellow-100 text-yellow-800" (fallback)
   * ```
   */
  getPriorityClass(priority: number): string {
    return (
      this.priorityConfig[priority as TaskPriority]?.class ||
      this.priorityConfig[TaskPriority.MEDIUM].class
    );
  }

  /**
   * Obtiene las clases CSS para el indicador visual de prioridad.
   *
   * @description
   * Retorna las clases CSS para elementos indicadores como dots o círculos
   * de color que representan visualmente la prioridad.
   *
   * @param priority - Nivel de prioridad numérico (1, 2 o 3)
   * @returns String con clases CSS para el indicador
   *
   * @example
   * ```typescript
   * strategy.getPriorityDotClass(TaskPriority.HIGH)   // → "bg-red-500"
   * strategy.getPriorityDotClass(TaskPriority.MEDIUM) // → "bg-amber-500"
   * strategy.getPriorityDotClass(0)                   // → "bg-amber-500" (fallback)
   * ```
   */
  getPriorityDotClass(priority: number): string {
    return (
      this.priorityConfig[priority as TaskPriority]?.dotClass ||
      this.priorityConfig[TaskPriority.MEDIUM].dotClass
    );
  }

  /**
   * Obtiene la etiqueta textual de la prioridad.
   *
   * @description
   * Retorna la representación textual localizada de la prioridad
   * en español. Útil para mostrar en interfaces de usuario.
   *
   * @param priority - Nivel de prioridad numérico (1, 2 o 3)
   * @returns Etiqueta textual de la prioridad
   *
   * @example
   * ```typescript
   * strategy.getPriorityLabel(TaskPriority.HIGH)   // → "Alta"
   * strategy.getPriorityLabel(TaskPriority.LOW)    // → "Baja"
   * strategy.getPriorityLabel(999)                 // → "Media" (fallback)
   * ```
   */
  getPriorityLabel(priority: number): string {
    return (
      this.priorityConfig[priority as TaskPriority]?.label ||
      this.priorityConfig[TaskPriority.MEDIUM].label
    );
  }
}

/**
 * Factory para crear instancias de estrategias de prioridad.
 *
 * @description
 * Implementa el patrón Factory Method para la creación de estrategias
 * de prioridad. Permite extensión futura sin modificar código existente,
 * siguiendo el principio Abierto/Cerrado (OCP).
 *
 * @features
 * - Creación centralizada de estrategias
 * - Soporte para múltiples tipos de estrategia
 * - Extensibilidad sin modificación de código existente
 * - Estrategia por defecto siempre disponible
 *
 * @example
 * ```typescript
 * const factory = inject(PriorityStrategyFactory);
 * const strategy = factory.createStrategy('default');
 * const label = strategy.getPriorityLabel(TaskPriority.HIGH);
 * ```
 *
 * @since 1.0.0
 * @author Team Frontend
 */
@Injectable({
  providedIn: 'root',
})
export class PriorityStrategyFactory {
  /**
   * Crea una instancia de estrategia de prioridad según el tipo especificado.
   *
   * @description
   * Factory method que crea y retorna la implementación apropiada
   * de IPriorityStrategy basada en el tipo solicitado. Facilita
   * la extensión futura con nuevas estrategias.
   *
   * @param type - Tipo de estrategia a crear ('default' | 'custom')
   * @returns Instancia de IPriorityStrategy
   *
   * @example
   * ```typescript
   * // Crear estrategia por defecto
   * const defaultStrategy = factory.createStrategy('default');
   * const customStrategy = factory.createStrategy('custom');
   *
   * // Sin parámetros usa 'default'
   * const strategy = factory.createStrategy();
   * ```
   *
   * @future
   * Aquí se pueden agregar nuevas estrategias:
   * - 'theme-based': estrategia basada en tema de la aplicación
   * - 'accessibility': estrategia con mejor contraste para accesibilidad
   * - 'custom': estrategia personalizable por el usuario
   */
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

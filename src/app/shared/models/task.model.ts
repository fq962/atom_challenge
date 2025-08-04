import { Observable } from 'rxjs';

// === INTERFACES DE RESPONSE ===

/**
 * Respuesta de la API para obtener múltiples tareas.
 *
 * @description
 * Estructura de respuesta estándar para operaciones que retornan
 * una colección de tareas con metadatos adicionales.
 */
export interface TaskResponse {
  /** Arreglo de tareas retornadas */
  data: Task[];
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Número total de tareas */
  count: number;
}

/**
 * Respuesta de la API para creación de tareas.
 *
 * @description
 * Estructura de respuesta cuando se crea una nueva tarea
 * exitosamente en el sistema.
 */
export interface CreateTaskResponse {
  /** Tarea creada */
  data: Task;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** ID del usuario propietario */
  id_user: string;
}

/**
 * Respuesta de la API para actualización de tareas.
 *
 * @description
 * Estructura de respuesta cuando se actualiza una tarea
 * existente en el sistema.
 */
export interface UpdateTaskResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Tarea actualizada */
  data: Task;
  /** ID del usuario propietario */
  id_user: string;
}

/**
 * Respuesta de la API para obtener todas las tareas.
 *
 * @description
 * Estructura de respuesta específica para la operación
 * de obtener todas las tareas de un usuario.
 */
export interface GetAllTasksResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Arreglo de todas las tareas */
  data: Task[];
  /** Número total de tareas */
  count: number;
  /** ID del usuario propietario */
  id_user: string;
}

/**
 * Respuesta genérica de la API para operaciones con una sola tarea.
 *
 * @description
 * Estructura de respuesta reutilizable para operaciones
 * que trabajan con una tarea individual.
 */
export interface ITaskResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Tarea retornada */
  data: Task;
  /** ID del usuario propietario */
  id_user: string;
}

/**
 * Respuesta de la API para eliminación de tareas.
 *
 * @description
 * Estructura de respuesta cuando se elimina una tarea
 * del sistema exitosamente.
 */
export interface DeleteTaskResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Datos nulos tras eliminación exitosa */
  data: null;
  /** ID del usuario propietario */
  id_user: string;
}

// === INTERFACES DE REQUEST ===

/**
 * Datos requeridos para crear una nueva tarea.
 *
 * @description
 * Interface que define los campos mínimos necesarios
 * para crear una tarea en el sistema.
 *
 * @example
 * ```typescript
 * const newTask: ICreateTaskRequest = {
 *   title: "Completar documentación",
 *   description: "Agregar JSDoc a todos los modelos",
 *   priority: TaskPriority.HIGH
 * };
 * ```
 */
export interface ICreateTaskRequest {
  /** Título de la tarea (máximo 100 caracteres) */
  title: string;
  /** Descripción detallada (máximo 500 caracteres) */
  description: string;
  /** Nivel de prioridad de la tarea */
  priority: number;
}

/**
 * Datos requeridos para eliminar una tarea.
 *
 * @description
 * Interface que define los datos necesarios para
 * eliminar una tarea específica del sistema.
 */
export interface DeleteTaskRequest {
  /** ID único de la tarea a eliminar */
  id: string;
}

/**
 * Datos para actualizar una tarea existente.
 *
 * @description
 * Interface que define los campos actualizables de una tarea.
 * Todos los campos son opcionales para permitir actualizaciones parciales.
 *
 * @example
 * ```typescript
 * const updateData: UpdateTaskRequestNew = {
 *   id: "task-123",
 *   is_done: true,
 *   priority: TaskPriority.LOW
 * };
 * ```
 */
export interface UpdateTaskRequestNew {
  /** ID único de la tarea a actualizar */
  id: string;
  /** Nuevo título (opcional, máximo 100 caracteres) */
  title?: string;
  /** Nueva descripción (opcional, máximo 500 caracteres) */
  description?: string;
  /** Estado de completado (opcional) */
  is_done?: boolean;
  /** Nueva prioridad (opcional) */
  priority?: number;
}

/**
 * Datos para actualizar una tarea (versión extendida).
 *
 * @description
 * Interface alternativa que extiende ICreateTaskRequest
 * para actualizaciones con campos opcionales.
 */
export interface UpdateTaskRequest extends Partial<ICreateTaskRequest> {
  /** ID único de la tarea a actualizar */
  id: string;
  /** Nuevo título (opcional) */
  title?: string;
  /** Nueva descripción (opcional) */
  description?: string;
  /** Nueva prioridad (opcional) */
  priority?: number;
  /** Estado de completado (opcional) */
  is_done?: boolean;
}

// === ENTIDADES PRINCIPALES ===

/**
 * Entidad principal que representa una tarea en el sistema.
 *
 * @description
 * Modelo de datos completo de una tarea con todos sus
 * atributos y metadatos de creación.
 *
 * @example
 * ```typescript
 * const task: Task = {
 *   id: "uuid-123",
 *   title: "Revisar código",
 *   description: "Hacer code review del PR #45",
 *   is_done: false,
 *   priority: TaskPriority.MEDIUM,
 *   created_at: new Date()
 * };
 * ```
 */
export interface Task {
  /** Identificador único de la tarea */
  id: string;
  /** Título descriptivo de la tarea */
  title: string;
  /** Descripción detallada de la tarea */
  description: string;
  /** Estado de completado de la tarea */
  is_done: boolean;
  /** Nivel de prioridad (1=Baja, 2=Media, 3=Alta) */
  priority: number;
  /** Fecha y hora de creación */
  created_at: Date;
}

// === INTERFACES DE ABSTRACCIÓN (SOLID) ===

/**
 * Contrato para el repositorio de tareas (Principio DIP).
 *
 * @description
 * Interface que abstrae las operaciones CRUD de tareas,
 * permitiendo diferentes implementaciones del repositorio.
 *
 * @example
 * ```typescript
 * class ApiTaskRepository implements ITaskRepository {
 *   getAllTasks(): Observable<GetAllTasksResponse> {
 *     return this.http.get<GetAllTasksResponse>('/api/tasks');
 *   }
 * }
 * ```
 */
export interface ITaskRepository {
  /** Obtiene todas las tareas del usuario actual */
  getAllTasks(): Observable<GetAllTasksResponse>;
  /** Crea una nueva tarea en el sistema */
  createTask(taskData: ICreateTaskRequest): Observable<ITaskResponse>;
  /** Actualiza una tarea existente */
  updateTask(taskData: UpdateTaskRequestNew): Observable<ITaskResponse>;
  /** Elimina una tarea del sistema */
  deleteTask(taskData: DeleteTaskRequest): Observable<DeleteTaskResponse>;
}

/**
 * Contrato para transformación de datos (Principio SRP).
 *
 * @description
 * Interface que define métodos para transformar datos
 * entre formatos de API y modelos locales.
 *
 * @example
 * ```typescript
 * class TaskDataTransformer implements ITaskDataTransformer {
 *   transformApiTaskToLocal(apiTask: any): Task {
 *     return {
 *       id: apiTask._id,
 *       title: apiTask.title,
 *       // ... más transformaciones
 *     };
 *   }
 * }
 * ```
 */
export interface ITaskDataTransformer {
  /** Transforma un arreglo de tareas de API a formato local */
  transformApiTasksToLocal(tasks: any[]): Task[];
  /** Transforma una tarea individual de API a formato local */
  transformApiTaskToLocal(task: any): Task;
}

/**
 * Contrato para estrategias de prioridad (Principio OCP).
 *
 * @description
 * Interface que define el comportamiento para manejar
 * la representación visual de prioridades de tareas.
 *
 * @example
 * ```typescript
 * class DefaultPriorityStrategy implements IPriorityStrategy {
 *   getPriorityLabel(priority: number): string {
 *     return priority === 3 ? 'Alta' : priority === 2 ? 'Media' : 'Baja';
 *   }
 * }
 * ```
 */
export interface IPriorityStrategy {
  /** Obtiene la clase CSS para el contenedor de prioridad */
  getPriorityClass(priority: number): string;
  /** Obtiene la clase CSS para el indicador visual */
  getPriorityDotClass(priority: number): string;
  /** Obtiene la etiqueta textual de la prioridad */
  getPriorityLabel(priority: number): string;
}

// === ENUMS ===

/**
 * Enumeración de niveles de prioridad para tareas.
 *
 * @description
 * Define los niveles estándar de prioridad disponibles
 * en el sistema con valores numéricos consistentes.
 *
 * @example
 * ```typescript
 * const highPriorityTask: ICreateTaskRequest = {
 *   title: "Tarea urgente",
 *   description: "Requiere atención inmediata",
 *   priority: TaskPriority.HIGH
 * };
 * ```
 */
export enum TaskPriority {
  /** Prioridad baja - Para tareas no urgentes */
  LOW = 1,
  /** Prioridad media - Para tareas regulares */
  MEDIUM = 2,
  /** Prioridad alta - Para tareas urgentes */
  HIGH = 3,
}

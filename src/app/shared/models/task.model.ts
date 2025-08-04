import { Observable } from 'rxjs';

export interface TaskResponse {
  data: Task[];
  message: string;
  success: boolean;
  count: number;
}

export interface CreateTaskResponse {
  data: Task;
  message: string;
  success: boolean;
  id_user: string;
}

export interface UpdateTaskResponse {
  success: boolean;
  message: string;
  data: Task;
  id_user: string;
}

export interface GetAllTasksResponse {
  success: boolean;
  message: string;
  data: Task[];
  count: number;
  id_user: string;
}

export interface ICreateTaskRequest {
  title: string; // Requerido, máximo 100 caracteres
  description: string; // Requerido, máximo 500 caracteres
  priority: number; // Requerido - Prioridad de la tarea
}

export interface ITaskResponse {
  success: boolean;
  message: string;
  data: Task;
  id_user: string;
}

export interface DeleteTaskRequest {
  id: string; // Requerido - ID de la tarea a eliminar
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
  data: null;
  id_user: string;
}

export interface UpdateTaskRequestNew {
  id: string; // Requerido - ID de la tarea a actualizar
  title?: string; // Opcional, máximo 100 caracteres
  description?: string; // Opcional, máximo 500 caracteres
  is_done?: boolean; // Opcional - Estado de completado
  priority?: number; // Opcional - Prioridad de la tarea
}

export interface Task {
  id: string;
  title: string;
  description: string;
  is_done: boolean;
  priority: number;
  created_at: Date;
}

// export interface CreateTaskRequest {
//   title: string;
//   description: string;
//   priority: number;
//   id_user: string;
// }

export interface UpdateTaskRequest extends Partial<ICreateTaskRequest> {
  id: string;
  title?: string;
  description?: string;
  priority?: number;
  is_done?: boolean;
}

// Nueva interfaz para abstraer el servicio de tareas (DIP)
export interface ITaskRepository {
  getAllTasks(): Observable<GetAllTasksResponse>;
  createTask(taskData: ICreateTaskRequest): Observable<ITaskResponse>;
  updateTask(taskData: UpdateTaskRequestNew): Observable<ITaskResponse>;
  deleteTask(taskData: DeleteTaskRequest): Observable<DeleteTaskResponse>;
}

// Interfaz para el transformador de datos (SRP)
export interface ITaskDataTransformer {
  transformApiTasksToLocal(tasks: any[]): Task[];
  transformApiTaskToLocal(task: any): Task;
}

// Interfaz para estrategia de prioridades (OCP)
export interface IPriorityStrategy {
  getPriorityClass(priority: number): string;
  getPriorityDotClass(priority: number): string;
  getPriorityLabel(priority: number): string;
}

// Enums para mejor type safety
export enum TaskPriority {
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
}

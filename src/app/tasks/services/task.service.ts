import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  Task,
  TaskResponse,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/tasks';

  // Signal privado para las tareas
  private _tasks = signal<Task[]>([]);

  // Signals computados públicos
  tasks = this._tasks.asReadonly();
  completedTasks = computed(() =>
    this._tasks().filter((task) => task.status === true)
  );
  pendingTasks = computed(() =>
    this._tasks().filter((task) => task.status === false)
  );
  taskCount = computed(() => this._tasks().length);
  completedCount = computed(() => this.completedTasks().length);
  pendingCount = computed(() => this.pendingTasks().length);

  constructor() {}

  // Obtener todas las tareas desde la API
  getAllTasks(): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(this.API_URL).pipe(
      catchError((error) => {
        console.error('Error al obtener las tareas:', error);
        return throwError(() => error);
      })
    );
  }

  // Cargar tareas y actualizar el signal
  loadTasks(): Observable<TaskResponse> {
    return this.getAllTasks().pipe(
      catchError((error) => {
        console.error('Error al cargar las tareas:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar el signal interno con las tareas cargadas
  setTasks(tasks: Task[]): void {
    // Convertir las fechas string a objetos Date
    const tasksWithDates = tasks.map((task) => ({
      ...task,
      created_at: new Date(task.created_at),
    }));
    this._tasks.set(tasksWithDates);
  }

  // Crear nueva tarea
  createTask(taskData: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.API_URL, taskData).pipe(
      catchError((error) => {
        console.error('Error al crear la tarea:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar tarea existente
  updateTask(id: string, updates: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, updates).pipe(
      catchError((error) => {
        console.error('Error al actualizar la tarea:', error);
        return throwError(() => error);
      })
    );
  }

  // Eliminar tarea
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar la tarea:', error);
        return throwError(() => error);
      })
    );
  }

  // Alternar estado de completado de una tarea
  toggleTaskStatus(id: string): void {
    const task = this._tasks().find((t) => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, status: !task.status };
    this.updateTask(id, { status: !task.status }).subscribe({
      next: (response) => {
        this._tasks.update((tasks) =>
          tasks.map((t) =>
            t.id === id
              ? { ...response, created_at: new Date(response.created_at) }
              : t
          )
        );
      },
      error: (error) => {
        console.error('Error al cambiar el estado de la tarea:', error);
      },
    });
  }

  // Obtener tarea por ID
  getTaskById(id: string): Task | undefined {
    return this._tasks().find((task) => task.id === id);
  }

  // Actualizar una tarea en el signal local después de una operación exitosa
  updateTaskInSignal(updatedTask: Task): void {
    this._tasks.update((tasks) =>
      tasks.map((task) =>
        task.id === updatedTask.id
          ? { ...updatedTask, created_at: new Date(updatedTask.created_at) }
          : task
      )
    );
  }

  // Agregar una nueva tarea al signal local
  addTaskToSignal(newTask: Task): void {
    this._tasks.update((tasks) => [
      ...tasks,
      { ...newTask, created_at: new Date(newTask.created_at) },
    ]);
  }

  // Eliminar una tarea del signal local
  removeTaskFromSignal(taskId: string): void {
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
  }
}

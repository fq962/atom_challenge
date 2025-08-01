import { Injectable, signal, computed } from '@angular/core';
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  // Signal privado para las tareas
  private _tasks = signal<Task[]>([]);

  // Signals computados públicos
  tasks = this._tasks.asReadonly();
  completedTasks = computed(() =>
    this._tasks().filter((task) => task.completed)
  );
  pendingTasks = computed(() =>
    this._tasks().filter((task) => !task.completed)
  );
  taskCount = computed(() => this._tasks().length);
  completedCount = computed(() => this.completedTasks().length);
  pendingCount = computed(() => this.pendingTasks().length);

  constructor() {
    // Cargar datos iniciales de ejemplo
    this.loadInitialData();
  }

  private loadInitialData() {
    const initialTasks: Task[] = [
      {
        id: '1',
        title: 'Completar proyecto Angular',
        description: 'Implementar todas las funcionalidades requeridas',
        completed: false,
        priority: 'high',
        dueDate: new Date('2024-12-31'),
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
      },
      {
        id: '2',
        title: 'Revisar documentación',
        description: 'Actualizar la documentación del proyecto',
        completed: true,
        priority: 'medium',
        createdAt: new Date('2024-11-28'),
        updatedAt: new Date('2024-11-30'),
      },
      {
        id: '3',
        title: 'Preparar presentación',
        completed: false,
        priority: 'low',
        dueDate: new Date('2024-12-15'),
        createdAt: new Date('2024-12-02'),
        updatedAt: new Date('2024-12-02'),
      },
    ];

    this._tasks.set(initialTasks);
  }

  createTask(taskData: CreateTaskRequest): Task {
    const newTask: Task = {
      id: this.generateId(),
      ...taskData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this._tasks.update((tasks) => [...tasks, newTask]);
    return newTask;
  }

  updateTask(id: string, updates: UpdateTaskRequest): Task | null {
    const taskIndex = this._tasks().findIndex((task) => task.id === id);
    if (taskIndex === -1) return null;

    const updatedTask: Task = {
      ...this._tasks()[taskIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this._tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? updatedTask : task))
    );

    return updatedTask;
  }

  deleteTask(id: string): boolean {
    const initialLength = this._tasks().length;
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
    return this._tasks().length < initialLength;
  }

  toggleTaskCompletion(id: string): boolean {
    const task = this._tasks().find((t) => t.id === id);
    if (!task) return false;

    this.updateTask(id, { completed: !task.completed });
    return true;
  }

  getTaskById(id: string): Task | undefined {
    return this._tasks().find((task) => task.id === id);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

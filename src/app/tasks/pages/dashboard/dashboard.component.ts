import { Component, signal, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskFacadeService } from '../../services/task-facade.service';
import { PriorityStrategyFactory } from '../../../shared/services/priority-strategy.service';
import {
  Task,
  ICreateTaskRequest,
  IPriorityStrategy,
} from '../../../shared/models/task.model';
import { CreateTaskDialogComponent } from '../../../shared/components/create-task-dialog/create-task-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, CreateTaskDialogComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex justify-between items-center py-4">
            <div>
              <h1 class="text-2xl font-semibold text-gray-900">Tareas</h1>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ taskCount() }} tareas en total
              </p>
            </div>
            <div class="flex items-center gap-3">
              <button
                (click)="openDialog()"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 transition-colors"
              >
                <svg
                  class="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Nueva
              </button>
              <button
                (click)="logout()"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 transition-colors"
                title="Cerrar sesión"
              >
                <svg
                  class="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-6 py-6">
        <!-- Stats -->
        <div class="flex gap-4 mb-6">
          <div
            class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600">Total:</span>
            <span class="font-medium">{{ taskCount() }}</span>
          </div>
          <div
            class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
          >
            <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span class="text-gray-600">Pendientes:</span>
            <span class="font-medium">{{ pendingCount() }}</span>
          </div>
          <div
            class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">Completadas:</span>
            <span class="font-medium">{{ completedCount() }}</span>
          </div>
        </div>

        <!-- Loading State -->
        @if (isLoading()) {
        <div class="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"
          ></div>
          <p class="mt-2 text-sm text-gray-500">Cargando tareas...</p>
        </div>
        }

        <!-- Error State -->
        @if (errorMessage()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex">
            <svg
              class="h-5 w-5 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div class="ml-3">
              <p class="text-sm text-red-700">{{ errorMessage() }}</p>
            </div>
          </div>
        </div>
        }

        <!-- Tasks List -->
        @if (!isLoading()) {
        <div class="bg-white rounded-lg border border-gray-200">
          @if (taskCount() === 0) {
          <div class="text-center py-8">
            <svg
              class="mx-auto h-8 w-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">No hay tareas</p>
          </div>
          } @else {
          <div class="divide-y divide-gray-200">
            @for (task of tasks(); track task.id) {
            <div
              class="group px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                [checked]="task.is_done"
                (change)="toggleTaskStatus(task.id, task.is_done)"
                class="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-1"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h4
                    class="text-sm font-medium truncate"
                    [class.text-gray-500]="task.is_done"
                    [class.line-through]="task.is_done"
                    [class.text-gray-900]="!task.is_done"
                  >
                    {{ task.title }}
                  </h4>
                  <div
                    class="w-2 h-2 rounded-full flex-shrink-0"
                    [class]="
                      priorityStrategy.getPriorityDotClass(task.priority)
                    "
                  ></div>
                </div>
                @if (task.description) {
                <p class="text-xs text-gray-500 mt-0.5 truncate">
                  {{ task.description }}
                </p>
                } @if (task.created_at) {
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ task.created_at | date : 'dd/MM/yyyy HH:mm' }}
                </p>
                }
              </div>
              <div
                class="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              >
                <button
                  (click)="editTask(task)"
                  class="text-gray-400 hover:text-blue-500 transition-colors p-1"
                  title="Editar"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  (click)="deleteTask(task.id)"
                  class="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Eliminar"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            }
          </div>
          }
        </div>
        }
      </div>

      <!-- Dialog -->
      @if (showDialog()) {
      <app-create-task-dialog
        [taskToEdit]="editingTask()"
        (taskCreated)="handleTaskAction($event)"
        (dialogClosed)="closeDialog()"
      />
      }
    </div>
  `,
  styles: [],
})
export class DashboardComponent implements OnInit {
  // Injección de dependencias usando abstracciones (DIP)
  private taskFacade = inject(TaskFacadeService);
  private router = inject(Router);
  private priorityStrategyFactory = inject(PriorityStrategyFactory);

  // Estrategia de prioridades (OCP)
  public readonly priorityStrategy: IPriorityStrategy;

  // Signals para el estado de la UI
  showDialog = signal(false);
  editingTask = signal<Task | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string>('');

  // Signals para las tareas
  tasks = signal<Task[]>([]);

  // Computed signals para estadísticas
  completedTasks = computed(() =>
    this.tasks().filter((task) => task.is_done === true)
  );
  pendingTasks = computed(() =>
    this.tasks().filter((task) => task.is_done === false)
  );
  taskCount = computed(() => this.tasks().length);
  completedCount = computed(() => this.completedTasks().length);
  pendingCount = computed(() => this.pendingTasks().length);

  constructor() {
    // Inicializar estrategia de prioridades
    this.priorityStrategy =
      this.priorityStrategyFactory.createStrategy('default');
  }

  ngOnInit() {
    this.loadAllTasks();
  }

  /**
   * Carga todas las tareas usando el facade
   * Responsabilidad única: coordinar la carga de datos
   */
  private loadAllTasks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.taskFacade.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
        this.errorMessage.set(error.message || 'Error al cargar las tareas');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Maneja tanto creación como actualización de tareas
   */
  handleTaskAction(taskData: ICreateTaskRequest): void {
    if (this.editingTask()) {
      this.updateTask(taskData);
    } else {
      this.createTask(taskData);
    }
  }

  /**
   * Crea una nueva tarea
   */
  private createTask(taskData: ICreateTaskRequest): void {
    this.taskFacade.createTask(taskData).subscribe({
      next: (newTask) => {
        this.tasks.update((currentTasks) => [newTask, ...currentTasks]);
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error al crear la tarea:', error);
        this.errorMessage.set(error.message || 'Error al crear la tarea');
      },
    });
  }

  /**
   * Actualiza una tarea existente
   */
  private updateTask(taskData: ICreateTaskRequest): void {
    const currentTask = this.editingTask();
    if (!currentTask) return;

    const updateData = {
      id: currentTask.id,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
    };

    this.taskFacade.updateTask(updateData).subscribe({
      next: (updatedTask) => {
        this.tasks.update((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error al actualizar la tarea:', error);
        this.errorMessage.set(error.message || 'Error al actualizar la tarea');
      },
    });
  }

  /**
   * Elimina una tarea
   */
  deleteTask(taskId: string): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    this.taskFacade.deleteTask(taskId).subscribe({
      next: () => {
        this.tasks.update((currentTasks) =>
          currentTasks.filter((task) => task.id !== taskId)
        );
      },
      error: (error) => {
        console.error('Error al eliminar la tarea:', error);
        this.errorMessage.set(error.message || 'Error al eliminar la tarea');
      },
    });
  }

  /**
   * Alterna el estado de completado de una tarea
   */
  toggleTaskStatus(taskId: string, currentStatus: boolean): void {
    this.taskFacade.toggleTaskStatus(taskId, currentStatus).subscribe({
      next: (updatedTask) => {
        this.tasks.update((currentTasks) =>
          currentTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      },
      error: (error) => {
        console.error('Error al cambiar el estado de la tarea:', error);
        this.errorMessage.set(
          error.message || 'Error al cambiar el estado de la tarea'
        );
      },
    });
  }

  /**
   * Abre el diálogo para crear una nueva tarea
   */
  openDialog(): void {
    this.editingTask.set(null);
    this.showDialog.set(true);
  }

  /**
   * Cierra el diálogo
   */
  closeDialog(): void {
    this.showDialog.set(false);
    this.editingTask.set(null);
  }

  /**
   * Abre el diálogo para editar una tarea
   */
  editTask(task: Task): void {
    this.editingTask.set(task);
    this.showDialog.set(true);
  }

  /**
   * Maneja el logout del usuario
   */
  logout(): void {
    // Aquí se podría inyectar un AuthService para manejar el logout
    this.router.navigate(['/login']);
  }
}

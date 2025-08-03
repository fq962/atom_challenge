import { Component, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import {
  Task,
  UpdateTaskRequest,
  ICreateTaskRequest,
  DeleteTaskRequest,
  UpdateTaskRequestNew,
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
                    [class]="getPriorityDotClass(task.priority)"
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
  showDialog = signal(false);
  editingTask = signal<Task | null>(null);
  isLoading = signal(true);

  // Signals para las tareas
  tasks = signal<Task[]>([]);

  // Computed signals
  completedTasks = computed(() =>
    this.tasks().filter((task) => task.is_done === true)
  );
  pendingTasks = computed(() =>
    this.tasks().filter((task) => task.is_done === false)
  );
  taskCount = computed(() => this.tasks().length);
  completedCount = computed(() => this.completedTasks().length);
  pendingCount = computed(() => this.pendingTasks().length);

  constructor(public taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.loadAllTasks();
  }

  // Función que usa el nuevo service para obtener todas las tareas
  loadAllTasks() {
    this.isLoading.set(true);

    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        console.log('Tareas obtenidas del API:', response);

        if (response.success && response.data) {
          // Convertir las fechas string a objetos Date
          const tasksWithDates = response.data.map((task) => ({
            ...task,
            created_at: new Date(task.created_at),
          }));

          // Actualizar el signal local con las tareas
          this.tasks.set(tasksWithDates);
        }

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar las tareas:', error);
        this.isLoading.set(false);
      },
    });
  }

  // loadTasks() {
  //   this.isLoading.set(true);
  //   this.taskService.loadTasks().subscribe({
  //     next: (response) => {
  //       console.log('API Response:', response);
  //       console.log('Tasks data:', response.data);

  //       // Actualizar el signal del servicio con las tareas
  //       this.taskService.setTasks(response.data);
  //       this.isLoading.set(false);
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar las tareas:', error);
  //       this.isLoading.set(false);
  //     },
  //   });
  // }

  // Función que maneja tanto creación como actualización
  handleTaskAction(taskData: ICreateTaskRequest) {
    if (this.editingTask()) {
      // Es una actualización
      this.onTaskUpdated(taskData);
    } else {
      // Es una nueva tarea
      this.onTaskCreated(taskData);
    }
  }

  // Función para crear nueva tarea usando el nuevo service
  onTaskCreated(taskData: ICreateTaskRequest) {
    this.taskService.createTask(taskData).subscribe({
      next: (response) => {
        console.log('Tarea creada exitosamente:', response);

        if (response.success && response.data) {
          // Convertir la fecha string a Date y agregar id_user
          const newTask: Task = {
            ...response.data,
            created_at: new Date(response.data.created_at),
          };

          // Actualizar el signal agregando la nueva tarea al principio
          this.tasks.update((currentTasks) => [newTask, ...currentTasks]);
        }

        this.closeDialog();
      },
      error: (error) => {
        console.error('Error al crear la tarea:', error);
        alert('Error al crear la tarea. Intenta nuevamente.');
      },
    });
  }

  // Función para actualizar tarea usando el nuevo service
  onTaskUpdated(taskData: ICreateTaskRequest) {
    const currentTask = this.editingTask();
    if (!currentTask) return;

    const updateRequest: UpdateTaskRequestNew = {
      id: currentTask.id,
      title: taskData.title,
      description: taskData.description,
      // Usar la nueva prioridad del formulario
      priority: taskData.priority,
    };

    this.taskService.updateTask(updateRequest).subscribe({
      next: (response) => {
        console.log('Tarea actualizada exitosamente:', response);

        if (response.success && response.data) {
          // Convertir la fecha string a Date
          const updatedTask: Task = {
            ...response.data,
            created_at: new Date(response.data.created_at),
          };

          // Actualizar el signal reemplazando la tarea actualizada
          this.tasks.update((currentTasks) =>
            currentTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        }

        this.closeDialog();
      },
      error: (error) => {
        console.error('Error al actualizar la tarea:', error);
        alert('Error al actualizar la tarea. Intenta nuevamente.');
      },
    });
  }

  // Función para eliminar tarea usando el nuevo service
  deleteTask(taskId: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      const deleteRequest: DeleteTaskRequest = {
        id: taskId,
      };

      this.taskService.deleteTask(deleteRequest).subscribe({
        next: (response) => {
          console.log('Tarea eliminada exitosamente:', response);

          if (response.success) {
            // Actualizar el signal removiendo la tarea eliminada
            this.tasks.update((currentTasks) =>
              currentTasks.filter((task) => task.id !== taskId)
            );
          }
        },
        error: (error) => {
          console.error('Error al eliminar la tarea:', error);
          alert('Error al eliminar la tarea. Intenta nuevamente.');
        },
      });
    }
  }

  // Función para alternar el estado de completado de una tarea
  toggleTaskStatus(taskId: string, currentStatus: boolean) {
    const updateRequest: UpdateTaskRequestNew = {
      id: taskId,
      is_done: !currentStatus,
    };

    this.taskService.updateTask(updateRequest).subscribe({
      next: (response) => {
        console.log('Estado de tarea actualizado:', response);

        if (response.success && response.data) {
          // Convertir la fecha string a Date
          const updatedTask: Task = {
            ...response.data,
            created_at: new Date(response.data.created_at),
          };

          // Actualizar el signal reemplazando la tarea actualizada
          this.tasks.update((currentTasks) =>
            currentTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        }
      },
      error: (error) => {
        console.error('Error al cambiar el estado de la tarea:', error);
        alert('Error al cambiar el estado de la tarea.');
      },
    });
  }

  openDialog() {
    this.editingTask.set(null);
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
    this.editingTask.set(null);
  }

  editTask(task: Task) {
    this.editingTask.set(task);
    this.showDialog.set(true);
  }

  // handleTaskAction(taskData: CreateTaskRequest) {
  //   if (this.editingTask()) {
  //     const updateData: UpdateTaskRequest = {
  //       id: this.editingTask()!.id,
  //       title: taskData.title,
  //       description: taskData.description,
  //       priority: taskData.priority,
  //     };
  //     this.onTaskUpdated(updateData);
  //   } else {
  //     this.onTaskCreated(taskData);
  //   }
  // }

  // onTaskCreated(taskData: CreateTaskRequest) {
  //   this.taskService.createTask(taskData).subscribe({
  //     next: (newTask) => {
  //       console.log('Nueva tarea creada:', newTask);
  //       this.taskService.addTaskToSignal(newTask.data);
  //       this.closeDialog();
  //     },
  //     error: (error) => {
  //       console.error('Error al crear la tarea:', error);
  //       alert('Error al crear la tarea');
  //     },
  //   });
  // }

  // onTaskUpdated(taskData: UpdateTaskRequest) {
  //   console.log('Enviando actualización de tarea:', taskData);

  //   this.taskService.updateTask(taskData).subscribe({
  //     next: (updatedTask) => {
  //       console.log('Tarea actualizada exitosamente:', updatedTask);
  //       this.taskService.updateTaskInSignal(updatedTask.data);
  //       this.closeDialog();
  //     },
  //     error: (error) => {
  //       console.error('Error al actualizar la tarea:', error);
  //       alert('Error al actualizar la tarea. Intenta nuevamente.');
  //     },
  //   });
  // }

  logout() {
    // Aquí puedes agregar lógica adicional como limpiar localStorage, etc.
    this.router.navigate(['/login']);
  }

  // toggleTask(id: string) {
  //   this.taskService.toggleTaskStatus(id);
  // }

  // deleteTask(id: string) {
  //   if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
  //     this.taskService.deleteTask(id).subscribe({
  //       next: () => {
  //         this.taskService.removeTaskFromSignal(id);
  //       },
  //       error: (error) => {
  //         console.error('Error al eliminar la tarea:', error);
  //         alert('Error al eliminar la tarea');
  //       },
  //     });
  //   }
  // }

  getPriorityClass(priority: number): string {
    const classes = {
      1: 'bg-green-100 text-green-800', // Baja
      2: 'bg-yellow-100 text-yellow-800', // Media
      3: 'bg-red-100 text-red-800', // Alta
    };
    return classes[priority as keyof typeof classes] || classes[2];
  }

  getPriorityDotClass(priority: number): string {
    const classes = {
      1: 'bg-green-500', // Baja
      2: 'bg-amber-500', // Media
      3: 'bg-red-500', // Alta
    };
    return classes[priority as keyof typeof classes] || classes[2];
  }

  getPriorityLabel(priority: number): string {
    const labels = {
      1: 'Baja',
      2: 'Media',
      3: 'Alta',
    };
    return labels[priority as keyof typeof labels] || 'Media';
  }
}

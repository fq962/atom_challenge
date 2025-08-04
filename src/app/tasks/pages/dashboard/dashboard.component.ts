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
  // === INYECCIÓN DE DEPENDENCIAS (DIP) ===

  /**
   * Servicio facade para operaciones de tareas.
   *
   * @description
   * Abstrae la complejidad de las operaciones CRUD de tareas
   * siguiendo el principio de Inversión de Dependencias.
   *
   * @private
   */
  private taskFacade = inject(TaskFacadeService);

  /**
   * Servicio de navegación de Angular.
   *
   * @description
   * Utilizado para navegación programática, especialmente
   * para el logout y redirección al login.
   *
   * @private
   */
  private router = inject(Router);

  /**
   * Factory para crear estrategias de prioridad.
   *
   * @description
   * Permite crear diferentes implementaciones de estrategias
   * de prioridad siguiendo el patrón Factory Method.
   *
   * @private
   */
  private priorityStrategyFactory = inject(PriorityStrategyFactory);

  // === ESTRATEGIAS (OCP) ===

  /**
   * Estrategia actual para manejo de prioridades.
   *
   * @description
   * Implementación concreta de IPriorityStrategy que define
   * cómo se renderizan visualmente las prioridades de las tareas.
   *
   * @readonly
   */
  public readonly priorityStrategy: IPriorityStrategy;

  // === SIGNALS DE ESTADO DE UI ===

  /**
   * Signal que controla la visibilidad del diálogo de tareas.
   *
   * @description
   * Controla cuándo mostrar u ocultar el modal de creación/edición
   * de tareas en la interfaz de usuario.
   *
   * @default false
   */
  showDialog = signal(false);

  /**
   * Signal que almacena la tarea en modo edición.
   *
   * @description
   * Cuando contiene una tarea, el diálogo se abre en modo edición.
   * Cuando es null, el diálogo se abre en modo creación.
   *
   * @default null
   */
  editingTask = signal<Task | null>(null);

  /**
   * Signal que indica si hay una operación de carga en progreso.
   *
   * @description
   * Controla la visualización del spinner de carga mientras
   * se obtienen las tareas desde el servidor.
   *
   * @default true
   */
  isLoading = signal(true);

  /**
   * Signal que contiene mensajes de error para mostrar al usuario.
   *
   * @description
   * Almacena mensajes de error para operaciones fallidas,
   * mostrándolos en la interfaz de usuario cuando no está vacío.
   *
   * @default ''
   */
  errorMessage = signal<string>('');

  // === SIGNALS DE DATOS ===

  /**
   * Signal que contiene la lista completa de tareas del usuario.
   *
   * @description
   * Array reactivo que se actualiza automáticamente cuando
   * se realizan operaciones CRUD en las tareas.
   *
   * @default []
   */
  tasks = signal<Task[]>([]);

  // === COMPUTED SIGNALS PARA ESTADÍSTICAS ===

  /**
   * Computed signal con las tareas completadas.
   *
   * @description
   * Se recalcula automáticamente cuando cambia el signal de tareas,
   * filtrando solo las tareas con is_done = true.
   *
   * @returns Array de tareas completadas
   */
  completedTasks = computed(() =>
    this.tasks().filter((task) => task.is_done === true)
  );

  /**
   * Computed signal con las tareas pendientes.
   *
   * @description
   * Se recalcula automáticamente cuando cambia el signal de tareas,
   * filtrando solo las tareas con is_done = false.
   *
   * @returns Array de tareas pendientes
   */
  pendingTasks = computed(() =>
    this.tasks().filter((task) => task.is_done === false)
  );

  /**
   * Computed signal con el total de tareas.
   *
   * @description
   * Cuenta automáticamente el número total de tareas
   * para mostrar en las estadísticas.
   *
   * @returns Número total de tareas
   */
  taskCount = computed(() => this.tasks().length);

  /**
   * Computed signal con el número de tareas completadas.
   *
   * @description
   * Cuenta automáticamente las tareas completadas
   * para mostrar en las estadísticas.
   *
   * @returns Número de tareas completadas
   */
  completedCount = computed(() => this.completedTasks().length);

  /**
   * Computed signal con el número de tareas pendientes.
   *
   * @description
   * Cuenta automáticamente las tareas pendientes
   * para mostrar en las estadísticas.
   *
   * @returns Número de tareas pendientes
   */
  pendingCount = computed(() => this.pendingTasks().length);

  // === CONSTRUCTOR ===

  /**
   * Constructor del componente dashboard.
   *
   * @description
   * Inicializa la estrategia de prioridades usando el factory pattern.
   * La estrategia se configura una sola vez al crear el componente.
   */
  constructor() {
    // Inicializar estrategia de prioridades
    this.priorityStrategy =
      this.priorityStrategyFactory.createStrategy('default');
  }

  // === LIFECYCLE HOOKS ===

  /**
   * Inicialización del componente.
   *
   * @description
   * Se ejecuta después de la construcción del componente.
   * Inicia la carga de todas las tareas del usuario.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.loadAllTasks();
  }

  // === MÉTODOS PRIVADOS ===

  /**
   * Carga todas las tareas del usuario desde el servidor.
   *
   * @description
   * Coordina la carga de datos utilizando el facade service.
   * Maneja estados de loading y errores apropiadamente.
   * Implementa el principio de Responsabilidad Única.
   *
   * @private
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta automáticamente en ngOnInit
   * this.loadAllTasks();
   * ```
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
   * Crea una nueva tarea en el sistema.
   *
   * @description
   * Utiliza el facade service para crear la tarea y actualiza
   * la lista local agregando la nueva tarea al inicio.
   *
   * @param taskData - Datos de la nueva tarea
   * @private
   * @returns {void}
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
   * Actualiza una tarea existente en el sistema.
   *
   * @description
   * Toma los datos del formulario y los combina con el ID de la tarea
   * que se está editando para enviar la actualización al servidor.
   *
   * @param taskData - Nuevos datos de la tarea
   * @private
   * @returns {void}
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

  // === MÉTODOS PÚBLICOS ===

  /**
   * Maneja tanto creación como actualización de tareas.
   *
   * @description
   * Método orquestador que determina si se debe crear una nueva tarea
   * o actualizar una existente basándose en el estado de editingTask.
   *
   * @param taskData - Datos de la tarea del formulario
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta desde el evento (taskCreated) del diálogo
   * this.handleTaskAction({
   *   title: "Nueva tarea",
   *   description: "Descripción",
   *   priority: 2
   * });
   * ```
   */
  handleTaskAction(taskData: ICreateTaskRequest): void {
    if (this.editingTask()) {
      this.updateTask(taskData);
    } else {
      this.createTask(taskData);
    }
  }

  /**
   * Elimina una tarea del sistema.
   *
   * @description
   * Muestra confirmación al usuario antes de eliminar y actualiza
   * la lista local removiendo la tarea eliminada.
   *
   * @param taskId - ID único de la tarea a eliminar
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta desde el botón de eliminar en el template
   * this.deleteTask("task-uuid-123");
   * ```
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
   * Alterna el estado de completado de una tarea.
   *
   * @description
   * Cambia el estado is_done de una tarea entre true/false
   * y actualiza la interfaz de usuario inmediatamente.
   *
   * @param taskId - ID único de la tarea
   * @param currentStatus - Estado actual de la tarea
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta desde el checkbox en el template
   * this.toggleTaskStatus("task-123", false); // Marcar como completada
   * ```
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
   * Abre el diálogo para crear una nueva tarea.
   *
   * @description
   * Resetea el estado de edición y muestra el modal en modo creación.
   * El diálogo se configura automáticamente para crear una nueva tarea.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta desde el botón "Nueva" en el template
   * this.openDialog();
   * ```
   */
  openDialog(): void {
    this.editingTask.set(null);
    this.showDialog.set(true);
  }

  /**
   * Cierra el diálogo de tareas.
   *
   * @description
   * Oculta el modal y resetea el estado de edición.
   * Limpia cualquier tarea que estuviera siendo editada.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta automáticamente tras crear/editar o cancelar
   * this.closeDialog();
   * ```
   */
  closeDialog(): void {
    this.showDialog.set(false);
    this.editingTask.set(null);
  }

  /**
   * Abre el diálogo para editar una tarea existente.
   *
   * @description
   * Configura el modal en modo edición cargando los datos
   * de la tarea seleccionada en el formulario.
   *
   * @param task - Tarea a editar
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta desde el botón de editar en cada tarea
   * this.editTask(selectedTask);
   * ```
   */
  editTask(task: Task): void {
    this.editingTask.set(task);
    this.showDialog.set(true);
  }

  /**
   * Maneja el logout del usuario.
   *
   * @description
   * Navega de vuelta a la página de login. En una implementación
   * completa, aquí se limpiaría el token de autenticación.
   *
   * @returns {void}
   *
   * @example
   * ```typescript
   * // Se ejecuta desde el botón "Salir" en el header
   * this.logout();
   * ```
   *
   * @todo Implementar limpieza de token con AuthService
   */
  logout(): void {
    // Aquí se podría inyectar un AuthService para manejar el logout
    this.router.navigate(['/login']);
  }
}

import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task, CreateTaskRequest } from '../../../shared/models/task.model';
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
                {{ taskService.taskCount() }} tareas en total
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
            <span class="font-medium">{{ taskService.taskCount() }}</span>
          </div>
          <div
            class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
          >
            <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span class="text-gray-600">Pendientes:</span>
            <span class="font-medium">{{ taskService.pendingCount() }}</span>
          </div>
          <div
            class="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm"
          >
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">Completadas:</span>
            <span class="font-medium">{{ taskService.completedCount() }}</span>
          </div>
        </div>

        <!-- Tasks List -->
        <div class="bg-white rounded-lg border border-gray-200">
          @if (taskService.taskCount() === 0) {
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
            @for (task of taskService.tasks(); track task.id) {
            <div
              class="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                [checked]="task.completed"
                (change)="toggleTask(task.id)"
                class="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-1"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h4
                    class="text-sm font-medium truncate"
                    [class.text-gray-500]="task.completed"
                    [class.line-through]="task.completed"
                    [class.text-gray-900]="!task.completed"
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
                } @if (task.dueDate) {
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ task.dueDate | date : 'dd/MM/yyyy' }}
                </p>
                }
              </div>
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
            }
          </div>
          }
        </div>
      </div>

      <!-- Dialog -->
      @if (showDialog()) {
      <app-create-task-dialog
        (taskCreated)="onTaskCreated($event)"
        (dialogClosed)="closeDialog()"
      />
      }
    </div>
  `,
  styles: [],
})
export class DashboardComponent {
  showDialog = signal(false);

  constructor(public taskService: TaskService, private router: Router) {}

  openDialog() {
    this.showDialog.set(true);
  }

  closeDialog() {
    this.showDialog.set(false);
  }

  onTaskCreated(taskData: CreateTaskRequest) {
    this.taskService.createTask(taskData);
  }

  logout() {
    // Aquí puedes agregar lógica adicional como limpiar localStorage, etc.
    this.router.navigate(['/login']);
  }

  toggleTask(id: string) {
    this.taskService.toggleTaskCompletion(id);
  }

  deleteTask(id: string) {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.taskService.deleteTask(id);
    }
  }

  getPriorityClass(priority: string): string {
    const classes = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return classes[priority as keyof typeof classes] || classes['medium'];
  }

  getPriorityDotClass(priority: string): string {
    const classes = {
      low: 'bg-green-500',
      medium: 'bg-amber-500',
      high: 'bg-red-500',
    };
    return classes[priority as keyof typeof classes] || classes['medium'];
  }

  getPriorityLabel(priority: string): string {
    const labels = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
    };
    return labels[priority as keyof typeof labels] || 'Media';
  }
}

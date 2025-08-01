import { Component, signal, output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CreateTaskRequest } from '../../models/task.model';

@Component({
  selector: 'app-create-task-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      (click)="onBackdropClick($event)"
    >
      <!-- Dialog -->
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="flex items-center justify-between p-4 border-b border-gray-200"
        >
          <h3 class="text-lg font-semibold text-gray-900">Nueva Tarea</h3>
          <button
            (click)="onCancel()"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="p-4">
          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Título *
              </label>
              <input
                type="text"
                id="title"
                formControlName="title"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="¿Qué necesitas hacer?"
                autofocus
              />
              @if (taskForm.get('title')?.invalid &&
              taskForm.get('title')?.touched) {
              <p class="mt-1 text-xs text-red-600">El título es requerido</p>
              }
            </div>

            <!-- Description -->
            <div>
              <label
                for="description"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <textarea
                id="description"
                formControlName="description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                placeholder="Detalles adicionales (opcional)"
              ></textarea>
            </div>

            <!-- Priority & Due Date -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label
                  for="priority"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prioridad
                </label>
                <select
                  id="priority"
                  formControlName="priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label
                  for="dueDate"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha límite
                </label>
                <input
                  type="date"
                  id="dueDate"
                  formControlName="dueDate"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div
            class="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100"
          >
            <button
              type="button"
              (click)="onCancel()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="taskForm.invalid || isSubmitting()"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              @if (isSubmitting()) {
              <span class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando...
              </span>
              } @else { Crear Tarea }
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class CreateTaskDialogComponent {
  taskForm: FormGroup;
  isSubmitting = signal(false);

  // Outputs usando la nueva API de Angular
  taskCreated = output<CreateTaskRequest>();
  dialogClosed = output<void>();

  constructor(private formBuilder: FormBuilder) {
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['medium'],
      dueDate: [''],
    });
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      this.isSubmitting.set(true);

      try {
        // Simular async operation
        await new Promise((resolve) => setTimeout(resolve, 500));

        const formValue = this.taskForm.value;
        const taskData: CreateTaskRequest = {
          title: formValue.title,
          description: formValue.description || undefined,
          priority: formValue.priority,
          dueDate: formValue.dueDate ? new Date(formValue.dueDate) : undefined,
        };

        this.taskCreated.emit(taskData);
        this.onCancel();
      } finally {
        this.isSubmitting.set(false);
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.taskForm.controls).forEach((key) => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.taskForm.reset({ priority: 'medium' });
    this.dialogClosed.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}

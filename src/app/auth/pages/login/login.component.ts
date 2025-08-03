import { Component, signal, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo electrónico para acceder
          </p>
        </div>
        <form
          class="mt-8 space-y-6"
          [formGroup]="loginForm"
          (ngSubmit)="onSubmit()"
        >
          <div class="rounded-md shadow-sm space-y-4">
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                formControlName="email"
                class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingresa tu correo electrónico"
              />
              @if (loginForm.get('email')?.invalid &&
              loginForm.get('email')?.touched) {
              <div class="mt-1 text-sm text-red-600">
                @if (loginForm.get('email')?.hasError('required')) { El correo
                electrónico es requerido } @if
                (loginForm.get('email')?.hasError('email')) { Ingresa un correo
                electrónico válido }
              </div>
              }
            </div>
          </div>

          @if (errorMessage()) {
          <div
            class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
          >
            {{ errorMessage() }}
          </div>
          }

          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading()"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                @if (isLoading()) {
                <svg
                  class="animate-spin h-5 w-5 text-indigo-500"
                  xmlns="http://www.w3.org/2000/svg"
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
                } @else {
                <svg
                  class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                }
              </span>
              @if (isLoading()) { Iniciando Sesión... } @else { Iniciar Sesión }
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta?
              <a
                href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent {
  // Signals para el estado del componente
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm: FormGroup;
  private userService = inject(UserService);

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const { email } = this.loginForm.value;

      this.userService.getUserByEmail(email).subscribe({
        next: (response) => {
          if (response.success && response.exists) {
            console.log('Usuario encontrado:', response);
            // Aquí puedes guardar el token en localStorage o en un servicio de autenticación
            localStorage.setItem('authToken', response.token);

            // Navegar al dashboard después del login exitoso
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage.set(
              'Usuario no encontrado. Verifica tu correo electrónico.'
            );
          }
        },
        error: (error) => {
          console.error('Error al verificar usuario:', error);
          this.errorMessage.set(
            'Error al verificar el usuario. Intenta nuevamente.'
          );
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}

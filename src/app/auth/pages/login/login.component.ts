import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

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
            Ingresa tus credenciales para acceder
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
                for="username"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autocomplete="username"
                required
                formControlName="username"
                class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingresa tu usuario"
              />
              @if (loginForm.get('username')?.invalid &&
              loginForm.get('username')?.touched) {
              <div class="mt-1 text-sm text-red-600">
                El usuario es requerido
              </div>
              }
            </div>

            <div>
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                formControlName="password"
                class="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Ingresa tu contraseña"
              />
              @if (loginForm.get('password')?.invalid &&
              loginForm.get('password')?.touched) {
              <div class="mt-1 text-sm text-red-600">
                La contraseña es requerida
              </div>
              }
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div class="text-sm">
              <a
                href="#"
                class="font-medium text-indigo-600 hover:text-indigo-500"
              >
                ¿Olvidaste tu contraseña?
              </a>
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

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      const { username, password } = this.loginForm.value;

      try {
        // Aquí puedes agregar la lógica de autenticación
        console.log('Login attempt:', { username, password });

        // Simular llamada async
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Navegar al dashboard después del login exitoso
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.errorMessage.set(
          'Error al iniciar sesión. Verifica tus credenciales.'
        );
      } finally {
        this.isLoading.set(false);
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.loginForm.controls).forEach((key) => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}

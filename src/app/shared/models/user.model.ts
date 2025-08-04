// === INTERFACES DE RESPONSE ===

/**
 * Respuesta de la API para operaciones de usuario.
 *
 * @description
 * Estructura de respuesta estándar para verificación de usuarios
 * y operaciones de autenticación en el sistema.
 *
 * @example
 * ```typescript
 * const response: UserResponse = {
 *   success: true,
 *   message: "Usuario encontrado",
 *   token: "jwt-token-here",
 *   exists: true
 * };
 * ```
 */
export interface UserResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Token JWT para autenticación (si aplica) */
  token: string;
  /** Indica si el usuario existe en el sistema */
  exists: boolean;
}

/**
 * Respuesta de la API para creación de usuarios.
 *
 * @description
 * Estructura de respuesta cuando se crea un nuevo usuario
 * exitosamente en el sistema.
 */
export interface CreateUserResponse {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Mensaje descriptivo de la operación */
  message: string;
  /** Token JWT del usuario recién creado */
  token: string;
}

// === ENTIDADES PRINCIPALES ===

/**
 * Entidad que representa un usuario en el sistema.
 *
 * @description
 * Modelo de datos básico de un usuario con su identificador
 * único y correo electrónico para autenticación.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   id_user: "uuid-123",
 *   mail: "usuario@ejemplo.com"
 * };
 * ```
 */
export interface User {
  /** Identificador único del usuario */
  id_user: string;
  /** Correo electrónico del usuario */
  mail: string;
}

// === INTERFACES DE REQUEST ===

/**
 * Datos requeridos para crear un nuevo usuario.
 *
 * @description
 * Interface que define los campos mínimos necesarios
 * para registrar un nuevo usuario en el sistema.
 *
 * @example
 * ```typescript
 * const newUser: CreateUserRequest = {
 *   mail: "nuevo.usuario@ejemplo.com"
 * };
 * ```
 */
export interface CreateUserRequest {
  /** Correo electrónico del nuevo usuario */
  mail: string;
}

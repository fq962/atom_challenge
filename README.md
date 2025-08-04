# 📋 Atom Challenge - Gestor de Tareas

Una aplicación web de gestión de tareas desarrollada con Angular 20, standalone components y TailwindCSS.

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene incluido con Node.js)

## 📦 Instalación

1. **Clona o descarga el proyecto:**

   ```bash
   git clone <url-del-repositorio>
   cd atom_challenge
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

## 🛠️ Comandos de Desarrollo

### Iniciar en modo desarrollo

```bash
npm run start:dev
```

La aplicación estará disponible en: `http://localhost:4200`

### Iniciar en modo producción (local)

```bash
npm run start:prod
```

### Compilar el proyecto

```bash
npm run build
```

### Modo watch (compilación automática)

```bash
npm run watch
```

## 🧪 Testing

### Ejecutar tests

```bash
npm run test
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── auth/              # Módulo de autenticación
│   │   ├── pages/login/   # Página de login
│   │   └── services/      # Servicios de usuario
│   ├── shared/            # Componentes y servicios compartidos
│   │   ├── components/    # Componentes reutilizables
│   │   ├── models/        # Modelos de datos
│   │   └── services/      # Servicios compartidos
│   ├── tasks/             # Módulo de tareas
│   │   ├── pages/dashboard/ # Dashboard principal
│   │   └── services/      # Servicios de tareas
│   └── environments/      # Configuraciones de entorno
```

## ✨ Características

- **Angular 20** - Framework más reciente
- **Standalone Components** - Arquitectura moderna sin módulos
- **TailwindCSS** - Estilos utilitarios
- **Reactive Forms** - Formularios reactivos
- **Signals** - Gestión de estado reactiva
- **SSR Ready** - Preparado para renderizado del servidor
- **Tests Unitarios** - Testing con Jasmine y Karma

## 🎯 Funcionalidades

- ✅ Crear nuevas tareas
- ✅ Editar tareas existentes
- ✅ Eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Sistema de prioridades
- ✅ Autenticación de usuarios
- ✅ Dashboard con estadísticas

## 🖥️ Uso de la Aplicación

1. **Inicia la aplicación** con `npm run start:dev`
2. **Navega** a `http://localhost:4200`
3. **Inicia sesión** con tus credenciales
4. **Gestiona tus tareas** desde el dashboard:
   - Haz clic en "Nueva" para crear una tarea
   - Usa el checkbox para marcar como completada
   - Haz clic en el ícono de editar para modificar
   - Haz clic en el ícono de eliminar para borrar

## 🚀 Despliegue

Para generar una versión optimizada para producción:

```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/` listos para ser desplegados en cualquier servidor web.

## 📝 Scripts Disponibles

| Comando              | Descripción               |
| -------------------- | ------------------------- |
| `npm run start:dev`  | Inicia en modo desarrollo |
| `npm run start:prod` | Inicia en modo producción |
| `npm run build`      | Compila para producción   |
| `npm run watch`      | Compilación en modo watch |
| `npm test`           | Ejecuta tests unitarios   |

## 🔧 Tecnologías Utilizadas

- **Angular 20**
- **TypeScript**
- **TailwindCSS**
- **RxJS**
- **Jasmine & Karma** (Testing)
- **Node.js & Express** (SSR)

---

¡Listo para empezar! 🎉

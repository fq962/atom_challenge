
# 🧠 Challenge Técnico - Fullstack v3

## 📝 Descripción

Este challenge consiste en desarrollar una aplicación de lista de tareas utilizando **Angular** para el frontend y una API con **Express + TypeScript + Firebase Functions + Firestore** como backend.  
La aplicación debe permitir agregar, editar, eliminar y marcar tareas como completadas.

---

## 🎯 Requisitos funcionales

1. La aplicación consta de **2 páginas**:
   - Página de **inicio de sesión** (solo requiere correo).
   - Página principal donde se muestran las tareas del usuario ordenadas por fecha de creación.

2. El flujo de login debe funcionar así:
   - Si el correo existe, se navega a la página principal.
   - Si no existe, se muestra un diálogo para crear el usuario. Luego se redirige.

3. La página principal debe tener:
   - Un formulario para agregar nuevas tareas.
   - Un botón para volver al login.

4. Cada tarea debe mostrar:
   - Título
   - Descripción
   - Fecha de creación
   - Estado (completada o pendiente)

5. Debe poder:
   - Marcar tareas como completadas/pendientes.
   - Editar y eliminar tareas.
   - Visualizar bien en diferentes dispositivos (**responsive**).

---

## 🔌 API - Backend

Implementado con **Express + TypeScript**, hosteado en **Firebase Functions** y usando **Firestore**.  

### Endpoints requeridos:

- `GET /tasks` - Obtener todas las tareas
- `POST /tasks` - Agregar una nueva tarea
- `PUT /tasks/:id` - Actualizar una tarea
- `DELETE /tasks/:id` - Eliminar una tarea
- `GET /users/:email` - Buscar si el usuario existe
- `POST /users` - Crear nuevo usuario

---

## 📐 Criterios de Evaluación

### ✅ Arquitectura y Organización

- Modularidad y separación de capas.
- Uso de arquitectura limpia o hexagonal.

### ✅ Patrones de Diseño

- Principios SOLID.
- Observables, servicios y componentes bien estructurados en frontend.
- DDD, repositorios, factories y singletons en backend.

### ✅ Manejo de Datos

- Servicios HTTP eficientes, validaciones y transformaciones.
- Seguridad en la comunicación con el API (tokens, autenticación).

### ✅ Binding y Directivas

- Uso correcto de `*ngIf`, `*ngFor`, directivas personalizadas.
- Uso de `async pipe`, `trackBy`, etc.

### ✅ Buenas Prácticas

- Principios: DRY, KISS, YAGNI.
- TypeScript con tipado estricto, interfaces y generics.
- Pruebas unitarias e integración (front y back).
- Código documentado y con README útil.

### ✅ Seguridad

- CORS, validaciones y gestión de tokens y secretos.

### ✅ Enrutamiento

- Uso correcto del `RouterModule`, guards, lazy loading.

### ✅ Estilo y Diseño

- Responsive (Angular Material, Bootstrap, etc).
- Estilos consistentes (SCSS, variables globales).
- Accesibilidad (ARIA, navegación por teclado).

### ✅ Entrega y Despliegue

- Scripts de build optimizados.
- CI/CD (opcional).
- Documentación clara del proceso de configuración.

---

## ⚠️ Notas Importantes

- Se evaluará **únicamente lo entregado**.
- **No es necesario implementar todo**, es preferible calidad sobre cantidad.
- Se valoran decisiones técnicas y claridad en la solución.
- Puedes agregar funcionalidades extra (filtros, categorías, UX mejorada).

---

## 🚀 Entrega

- Sube tu código a un repositorio **público** (ej: GitHub).
- Publica la app en **Firebase Hosting** (preferido) o alternativa como [Stackblitz](https://stackblitz.com).
- Incluye documentación con:
  - Decisiones de diseño
  - Tecnologías utilizadas
  - Comentarios relevantes

---

## 📦 Plantilla de Referencia

- [Template Angular 17](https://github.com/Sebastian-Andrade-T/atom-fe-challenge-template-ng-17)

---

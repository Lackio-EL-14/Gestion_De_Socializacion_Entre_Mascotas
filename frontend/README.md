
---

# README_FRONTEND.md

```markdown
# DogChat Frontend

Frontend del sistema **DogChat**, desarrollado con Angular.

La aplicación permite a los usuarios:

- registrarse
- gestionar perfiles de mascotas
- interactuar con otros dueños
- utilizar el sistema de matching entre mascotas

---

# 1. Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| Angular | Framework frontend |
| TypeScript | Lenguaje principal |
| HTML5 | Estructura de interfaz |
| CSS3 | Estilos |
| Figma | Diseño de prototipos |
| Git / GitHub | Control de versiones |

---

# 2. Arquitectura del Frontend

El frontend se basa en una **arquitectura basada en componentes** proporcionada por Angular.

Principales elementos:

- **Components**
  - Representan las vistas del sistema

- **Services**
  - Manejan la comunicación con la API

- **Models**
  - Representan la estructura de datos

- **Routing**
  - Controla la navegación entre pantallas

---

# 3. Estructura del Proyecto

Ejemplo de estructura:

frontend
│
├── src
│ ├── app
│ │
│ │ ├── components
│ │ ├── pages
│ │ ├── services
│ │ ├── models
│ │ └── app-routing.module.ts
│ ├── assets
│ ├── environments
│ └── index.html
│
├── angular.json
└── package.json


---

# 4. Prototipo de Diseño

El diseño de la interfaz fue realizado utilizando **Figma**.

Link al prototipo:
aqui falta el link al prototipo


---

# 5. Instalación

Instalar dependencias:

```bash
npm install
```

---

# 6. Ejecución del Proyecto

Para iniciar el servidor de desarrollo de Angular ejecutar:

```bash
npm install
```

Luego abrir la aplicación en el navegador:

http://localhost:4200 //cambiar ruta si se necesita

Angular recargará automáticamente la aplicación cuando detecte cambios en los archivos fuente.

---

# 7. Comunicación con el Backend

El frontend se comunica con el backend mediante **peticiones HTTP a una API REST**.

Se utilizan **servicios de Angular** para centralizar la comunicación con el servidor.

Ejemplo de servicio:

```ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(private http: HttpClient) {}

  getPets() {
    return this.http.get('/api/pets');
  }

}
```
Este ejemplo es ilustrativo.

---

# 8. Componentes Principales

Ejemplo de algunos componentes del sistema:

| Componente | Función |
|------------|--------|
| `login-component` | Pantalla de inicio de sesión |
| `register-component` | Registro de usuarios |
| `pet-profile-component` | Visualización del perfil de una mascota |
| `feed-component` | Feed de mascotas disponibles |

*Los componentes mostrados son ejemplos.*

---

# 9. Convenciones de Código

Convenciones utilizadas dentro del proyecto:

| Elemento | Convención |
|----------|------------|
| Componentes | `kebab-case` |
| Servicios | `*.service.ts` |
| Modelos | `*.model.ts` |
| Interfaces | `PascalCase` |

Estas convenciones ayudan a mantener un código organizado y consistente entre todos los desarrolladores.

---

# 10. Herramientas de Desarrollo

| Herramienta | Uso |
|-------------|-----|
| Visual Studio Code | Desarrollo del frontend |
| Figma | Diseño de prototipos de interfaz |
| GitHub | Control de versiones |

# 11. Extras generados automaticamente

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## HU-01
Se implementó la primera historia de usuario, para registrar al dueño:

### Estructura usada para el registro de dueño (Auth)

frontend/src/app
|
|- features/auth .................................... Módulo funcional de autenticación
|  |- auth-module.ts ................................. Agrupa componentes y dependencias de Auth
|  |- auth-routing-module.ts ......................... Archivo de rutas del módulo Auth (actualmente vacío)
|  |- register/
|  |  |- register.ts ................................. Lógica del formulario y envío al backend
|  |  |- register.html ............................... Vista del formulario de registro de dueño
|  |  |- register.scss ............................... Estilos de la pantalla de registro
|  |- login/
|     |- login.ts .................................... Componente de login (base)
|     |- login.html .................................. Vista de login (pendiente de desarrollo)
|
|- app-routing-module.ts ............................ Ruta global: redirige a register y muestra Register
|- app-module.ts .................................... Módulo principal: importa HttpClient y Register
|- core/services/auth.ts ............................ Servicio Auth creado (aun sin metodos implementados)

### Que se hizo en el registro de dueño

1. Se creo el componente Register dentro de Auth como componente standalone.
2. Se construyo un formulario con campos: nombre, email, telefono, contrasena y confirmar contrasena.
3. Se agregaron validaciones basicas en frontend:
  - Todos los campos obligatorios.
  - Validacion de coincidencia entre contrasena y confirmacion.
4. Se integro el envio por HTTP POST al endpoint:
  - http://localhost:3000/usuarios/registro
5. Se manejo respuesta de exito y error con alertas y limpieza del formulario.
6. Se conecto la ruta principal para abrir directamente la vista de registro.

Es una implementacion inicial funcional de HU-01: permite registrar un dueño desde la interfaz y enviar los datos al backend, todas las pruebas pasaron de manera eficiente.

## HU-02
Se implementó la segunda historia de usuario, para iniciar sesión en el sistema:

### Estructura usada para el inicio de sesión (Auth)

frontend/src/app
|
|- features/auth .................................... Módulo funcional de autenticación
|  |- auth-module.ts ................................. Agrupa componentes y dependencias de Auth
|  |- auth-routing-module.ts ......................... Archivo de rutas del módulo Auth
|  |- login/
|  |  |- login.ts .................................... Lógica de autenticación y envío al backend
|  |  |- login.html .................................. Vista del formulario de inicio de sesión
|  |  |- login.scss .................................. Estilos de la pantalla de login
|  |- register/
|     |- register.ts ................................. Componente de registro ya implementado en HU-01
|     |- register.html ............................... Vista de registro
|
|- app-routing-module.ts ............................ Define las rutas principales del sistema
|- app-module.ts .................................... Módulo raíz que importa HttpClient
|- core/services/auth.ts ............................ Servicio Auth preparado para futura gestión de sesión

### Que se hizo en el inicio de sesión

1. Se implementó el componente **Login** dentro del módulo **Auth**.

2. Se construyó un formulario de autenticación con los campos:
   - email
   - contraseña

3. Se agregaron validaciones básicas en frontend:
   - Email obligatorio.
   - Validación de formato de email.
   - Contraseña obligatoria.
   - Contraseña mínima de 6 caracteres.

4. Se integró el envío al backend mediante una petición HTTP POST al endpoint:

   - http://localhost:3000/usuarios/login

5. Se implementó manejo de respuestas del servidor:
   - Si las credenciales son correctas → se muestra modal de inicio de sesión exitoso.
   - Si ocurre un error → se muestra un modal con el mensaje retornado por el backend o un mensaje genérico.

6. Se reemplazaron los `alert()` por un **sistema de modal reutilizable** para mostrar:
   - errores de validación
   - errores del backend
   - mensajes de éxito

7. Se utilizó **ChangeDetectorRef** para asegurar la actualización inmediata de la vista cuando el backend retorna errores.

### Resultado

La implementación de HU-02 permite que un usuario registrado:

- ingrese sus credenciales desde la interfaz
- valide errores básicos en frontend
- autentique contra el backend
- reciba retroalimentación visual mediante modales.

La funcionalidad cumple con los criterios de aceptación definidos para la autenticación inicial del sistema.

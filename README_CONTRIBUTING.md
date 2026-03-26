# Contributing to DogChat

Gracias por tu interés en contribuir al proyecto **DogChat**.  
Este documento describe las normas y el flujo de trabajo que deben seguir los miembros del equipo para colaborar correctamente en el desarrollo del sistema.

---

# 1. Flujo de Trabajo del Proyecto

El proyecto utiliza **Git y GitHub** para el control de versiones.

La estrategia de ramas utilizada es la siguiente:

| Rama | Descripción |
|-----|-------------|
| `main` | Versión estable del proyecto |
| `develop` | Rama principal de desarrollo |
| `feature/*` | Nuevas funcionalidades |
| `hotfix/*` | Correcciones urgentes |

---

# 2. Proceso para Contribuir

Para realizar cambios en el proyecto se debe seguir el siguiente flujo:

## 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/dogchat.git
cd dogchat
```

## 2. Crear una nueva rama

Las nuevas funcionalidades deben desarrollarse en ramas `feature`.

```bash
git checkout -b feature/nombre-funcionalidad
```

Ejemplo:

```bash
git checkout -b feature/login-system
```

## 3. Realizar cambios

Implementar la funcionalidad o corrección correspondiente siguiendo las convenciones de código del proyecto.

## 4. Confirmar cambios

```bash
git add .
git commit -m "feat: agregar sistema de login"
```

## 5. Subir cambios al repositorio

```bash
git push origin feature/nombre-funcionalidad
```

## 6. Crear Pull Request

Una vez terminada la funcionalidad se debe crear un **Pull Request** hacia la rama `develop`.

El Pull Request debe incluir:

- Descripción de los cambios
- Funcionalidad implementada
- Capturas o pruebas si corresponde

---

# 3. Convención de Commits

Para mantener un historial de cambios claro se utilizan prefijos en los commits.

| Prefijo | Uso |
|-------|-----|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de errores |
| `docs:` | Cambios en documentación |
| `style:` | Cambios de formato o estilo |
| `refactor:` | Mejora interna del código |
| `test:` | Agregar o modificar pruebas |

Ejemplo:

```bash
git commit -m "feat: agregar módulo de mascotas"
```

---

# 4. Convenciones de Código

Para mantener consistencia en el proyecto se siguen las siguientes convenciones.

## Backend

- Lenguaje: **TypeScript**
- Framework: **NestJS**
- Arquitectura modular
- Separación en:

```
modules
controllers
services
entities
dto
```

---

## Frontend

- Framework: **Angular**
- Arquitectura basada en componentes

Convenciones:

| Elemento | Convención |
|--------|-----------|
| Componentes | kebab-case |
| Servicios | *.service.ts |
| Modelos | *.model.ts |

---

# 5. Pruebas

Antes de subir cambios al repositorio se recomienda verificar que el sistema funcione correctamente.

Ejemplo de pruebas:

Backend:

```bash
npm run test
```

Frontend:

```bash
ng serve
```

También se pueden realizar pruebas de API mediante **Postman**.

---

# 6. Gestión de Tareas

El equipo utiliza **Trello** para la gestión de tareas del proyecto.

Las tareas se organizan en:

- Backlog
- To Do
- In Progress
- Review
- Done

Cada miembro del equipo debe actualizar el estado de sus tareas durante el desarrollo del sprint.

---

# 7. Roles del Equipo

| Rol | Integrante |
|-----|-----------|
| Product Owner | Alejandro Alvarez Huayhua |
| Scrum Master | Juan Mateo Soruco Sejas |
| Backend Developer | Luis Felipe Salazar Aramayo |
| Backend Developer | Edson Lamar Accocer |
| Frontend Developer | Cesar Cadiz Rivero |
| Frontend Developer | Juan Mateo Soruco Sejas |
| Frontend Developer | Alejandro Alvarez Huayhua |
| QA | Todo el equipo |

---

# 8. Reglas Generales

- Mantener el código limpio y documentado.
- Seguir las convenciones definidas en el proyecto.
- No subir código que rompa la compilación del sistema.
- Revisar los Pull Requests antes de integrarlos a la rama principal.
- Mantener comunicación con el equipo durante el desarrollo del sprint.

---

Gracias por contribuir al desarrollo de **DogChat**.
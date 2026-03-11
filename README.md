# DogChat

Plataforma digital orientada a facilitar la interacción entre dueños de perros con el objetivo de promover la socialización responsable entre mascotas.

---

# 1. Introducción

El presente documento describe el diseño técnico del **Sistema de Información DogChat**, una plataforma digital orientada a facilitar la interacción entre dueños de perros con el objetivo de promover la socialización responsable entre mascotas.

Su propósito es modelar la arquitectura, los componentes principales y el comportamiento del sistema antes de su implementación, garantizando la coherencia entre los requerimientos definidos en la fase de análisis y el proceso de desarrollo posterior.

Este documento servirá como base para guiar el desarrollo del sistema durante la ejecución de los **sprints del proyecto**, permitiendo mantener consistencia en la implementación de las funcionalidades y facilitando la validación técnica del sistema.

---

# 2. Arquitectura General del Sistema

Se propone una **arquitectura cliente-servidor basada en tres capas**, que permite separar responsabilidades dentro del sistema y facilitar su mantenimiento, escalabilidad y evolución futura.

## Capa de Presentación

Implementada utilizando **Angular**, accesible a través de un navegador web.

Características:

- Interfaz de usuario basada en componentes reutilizables.
- Navegación gestionada mediante **Angular Routing**.
- Organización modular de la interfaz.

Pantallas principales:

- Registro e inicio de sesión de usuarios
- Visualización y gestión de información
- Interacción con funcionalidades del sistema

La comunicación con el servidor se realiza mediante **peticiones HTTP a una API REST**.

---

## Capa de Lógica de Negocio

Implementada en el **backend del sistema**, encargado de procesar las solicitudes enviadas desde el frontend.

Responsabilidades principales:

- Procesamiento de acciones realizadas por los usuarios
- Validación de datos recibidos desde el cliente
- Ejecución de la lógica del sistema
- Gestión de autenticación y autorización
- Generación de respuestas para el frontend

Esta capa actúa como **intermediaria entre la interfaz de usuario y la base de datos**.

---

## Capa de Persistencia

Encargada del almacenamiento y gestión de los datos del sistema.

Se utiliza una **base de datos relacional** donde se almacena la información necesaria para el funcionamiento de la aplicación.

Entre los datos almacenados se encuentran:

- Usuarios del sistema
- Información de perfiles
- Registros de interacciones
- Historial de actividades o acciones realizadas

Operaciones principales:

- Almacenamiento
- Consulta
- Actualización
- Eliminación de datos

---

## Patrón Arquitectónico

El sistema sigue un patrón arquitectónico basado en **MVC (Modelo-Vista-Controlador)**.

### Modelo (Model)

Representa los datos del sistema y su estructura dentro de la base de datos.

### Vista (View)

Corresponde a la interfaz de usuario desarrollada con **Angular**.

### Controlador (Controller)

Implementado en el backend, encargado de:

- Recibir solicitudes del cliente
- Procesarlas
- Devolver respuestas correspondientes

Esta arquitectura permite mantener una **estructura modular y organizada**, facilitando el desarrollo colaborativo y la evolución futura del sistema.

---

# 3. Modelo Funcional – Diagrama de Casos de Uso

![Diagrama de Casos de Uso](/docs/diagrams/CasosDeUso.png)

---

# 4. Actores del Sistema

El sistema contempla los siguientes actores principales:

- **Usuario Dueño**
- **Administrador**
- **Trabajador del rubro de mascotas**

---

# 5. Casos de Uso Principales

### Gestión de Usuarios

- Registrarse
- Iniciar sesión
- Cerrar sesión
- Editar perfil personal
- Publicar contenido en perfil
- Reportar perfil
- Ver publicaciones

### Gestión de Mascotas

- Crear perfil de mascota (máximo 20)
- Editar perfil de mascota
- Subir certificado médico
- Subir fotografía de mascota
- Visualizar mis mascotas

### Sistema de Interacción

- Aplicar filtros avanzados
- Ver tarjetas aleatorias (Feed)
- Dar “Huesito”
- Dar “Next”
- Recibir notificación de Match

### Sistema de Mensajería

- Iniciar chat (requiere Match)
- Enviar mensaje
- Recibir mensaje

### Administración

- Ver reportes
- Suspender cuenta
- Aplicar strike
- Desestimar reporte
- Revisar publicación
- Aprobar publicación
- Rechazar publicación
- Revisar certificado médico
- Aprobar certificado
- Rechazar certificado

### Funciones para Trabajadores del Rubro

- Registrarse como trabajador
- Crear perfil profesional
- Editar perfil profesional
- Crear publicación de servicio
- Subir imagen de servicio
- Enviar publicación para aprobación

---

# 6. Estructura del Repositorio

dogchat
│
├── backend
│ ├── src
│ │ ├── modules
│ │ ├── app.controller.ts
│ │ ├── app.module.ts
│ │ └── main.ts
│ ├── test
│ ├── package.json
│ ├── README_BACKEND.md
│ └── tsconfig.json
│
├──database
│
├── docs
│ └── diagrams
│
├── frontend
│ ├── public
│ ├── src
│ │ ├── app
│ │ │ ├── core
│ │ │ ├── features
│ │ │ ├── app-module.ts
│ │ │ ├── app.html
│ │ │ ├── app.scss
│ │ │ └── app.ts
│ │ ├── index.html
│ │ ├── main.ts
│ │ └── styles.scss
│ └── package.json
│
└── README.md

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

# 7. Instalación del Proyecto

Clonar el repositorio:

```bash
git clone https://github.com/usuario/dogchat.git
cd dogchat

```

Instalar dependencias del backend y frontend.

# 8. Ejecución del Proyecto
## Backend
```bash
npm run start:dev
```
## Frontend
```bash
ng serve
```

Luego abrir en el navegador:

http://localhost:4200

# 9. Roles del Equipo
Rol	Integrante
Product Owner	Alejandro Alvarez Huayhua
Scrum Master	Juan Mateo Soruco Sejas
Backend Developer	Luis Felipe Salazar Aramayo
Backend Developer	Edson Lamar Accocer
Frontend Developer	Cesar Cadiz Rivero
Frontend Developer	Juan Mateo Soruco Sejas
Frontend Developer	Alejandro Alvarez Huayhua
QA	Todo el equipo
# 10. Metodología de Desarrollo

El proyecto se desarrolla utilizando la metodología Scrum.

Características principales del proceso:

Desarrollo iterativo mediante Sprints

Gestión de tareas mediante Trello

Revisión y planificación periódica del trabajo del equipo

Distribución de responsabilidades según roles Scrum

11. Licencia

Este proyecto se distribuye bajo la licencia MIT.

Esto permite utilizar, modificar y distribuir el software siempre que se mantenga la atribución correspondiente a los autores del proyecto.


---


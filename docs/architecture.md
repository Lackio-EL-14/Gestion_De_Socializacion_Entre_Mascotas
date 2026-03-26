# System Architecture

Este documento describe la **arquitectura general del sistema DogChat** y cómo interactúan sus principales componentes.  
Los detalles específicos de cada parte del sistema se encuentran en los documentos correspondientes dentro del repositorio.

---

# 1. Visión General

DogChat sigue una **arquitectura cliente-servidor**, donde:

- El **frontend** gestiona la interfaz de usuario.
- El **backend** procesa la lógica del sistema y expone una API.
- La **base de datos** almacena la información persistente.

El frontend se comunica con el backend mediante **peticiones HTTP a una API REST**, y el backend interactúa con la base de datos para almacenar y recuperar información.

---

# 2. Componentes del Sistema

## Frontend

El frontend está desarrollado con **Angular** y se encarga de:

- Mostrar la interfaz de usuario.
- Gestionar la interacción con los usuarios.
- Consumir la API del backend.
- Manejar el estado de la aplicación en el cliente.

Más detalles en:

```
README_FRONTEND.md
```

---

## Backend

El backend está desarrollado con **NestJS** y tiene las siguientes responsabilidades:

- Exponer una **API REST** para el frontend.
- Procesar la lógica del sistema.
- Gestionar autenticación y autorización.
- Coordinar el acceso a la base de datos.

Más detalles en:

```
README_BACKEND.md
```

---

## Base de Datos

La base de datos almacena toda la información persistente del sistema, incluyendo:

- Usuarios
- Mascotas
- Interacciones entre mascotas
- Mensajes entre usuarios

Más detalles en:

```
README_DATABASE.md
```

---

# 3. Flujo de Comunicación

El flujo principal de comunicación en el sistema es el siguiente:

```
Usuario
   ↓
Frontend (Angular)
   ↓ HTTP Requests
Backend API (NestJS)
   ↓
Base de Datos (MariaDB)
```

1. El usuario interactúa con la interfaz del frontend.
2. El frontend envía solicitudes HTTP al backend.
3. El backend procesa la solicitud.
4. Si es necesario, el backend consulta o modifica la base de datos.
5. El backend devuelve una respuesta al frontend.
6. El frontend actualiza la interfaz para el usuario.

---

# 4. Estructura de Documentación

La documentación del proyecto está organizada de la siguiente manera:

```
docs/
 ├─ architecture.md
 ├─ diagrams/
 ├─ api/
 └─ database/
```

Además, el repositorio incluye documentos específicos para cada componente:

- `README_BACKEND.md`
- `README_FRONTEND.md`
- `README_DATABASE.md`
- `README_API.md`
- `README_CONTRIBUTING.md`

Estos documentos contienen información detallada sobre cada parte del sistema.

---

# 5. Consideraciones de Diseño

El sistema fue diseñado con los siguientes objetivos:

- **Separación clara de responsabilidades** entre frontend, backend y base de datos.
- **Escalabilidad**, permitiendo agregar nuevas funcionalidades fácilmente.
- **Mantenibilidad**, facilitando el trabajo colaborativo entre desarrolladores.
- **Modularidad**, especialmente en el backend mediante el uso de módulos.

---

# 6. Diagramas

Los diagramas del sistema se encuentran en la carpeta:

```
docs/diagrams/
```

Estos diagramas pueden incluir:

- Diagramas de arquitectura
- Diagramas UML
- Diagramas de base de datos
- Diagramas de flujo del sistema
# DogChat API

Este documento describe los endpoints disponibles en la **API REST del sistema DogChat**.

La API permite gestionar usuarios, perfiles de mascotas, interacciones entre mascotas y comunicación entre usuarios.

El backend está construido utilizando **NestJS**, exponiendo endpoints REST que son consumidos por el frontend desarrollado en **Angular**.

---

# 1. Información General

| Característica | Valor |
|---------------|------|
| Arquitectura | API REST |
| Framework Backend | NestJS |
| Lenguaje | TypeScript |
| Base de datos | MariaDB |
| ORM | TypeORM |

---

# 2. URL Base de la API

Ejemplo de URL base en desarrollo:

```
http://localhost:3000/api
```

*La URL puede variar dependiendo del entorno.*

---

# 3. Autenticación

La API utiliza autenticación basada en **JWT (JSON Web Tokens)**.

Después de iniciar sesión correctamente, el servidor devuelve un token que debe enviarse en las solicitudes protegidas.

Ejemplo de header:

```
Authorization: Bearer <token>
```

---

# 4. Endpoints de Autenticación

## Registrar Usuario

**Endpoint**

```
POST /auth/register
```

### Request

```json
{
  "name": "Juan",
  "email": "juan@email.com",
  "password": "123456"
}
```

### Response

```json
{
  "message": "Usuario registrado correctamente"
}
```

*(Ejemplo de respuesta)*

---

## Iniciar Sesión

**Endpoint**

```
POST /auth/login
```

### Request

```json
{
  "email": "juan@email.com",
  "password": "123456"
}
```

### Response

```json
{
  "token": "jwt_token_example"
}
```

*(Ejemplo de respuesta)*

---

# 5. Endpoints de Usuarios

## Obtener Perfil de Usuario

```
GET /users/:id
```

### Response

```json
{
  "id": 1,
  "name": "Juan",
  "email": "juan@email.com"
}
```

*(Ejemplo de respuesta)*

---

## Actualizar Perfil

```
PATCH /users/:id
```

### Request

```json
{
  "name": "Juan Mateo"
}
```

### Response

```json
{
  "message": "Perfil actualizado"
}
```

*(Ejemplo)*

---

# 6. Endpoints de Mascotas

## Crear Perfil de Mascota

```
POST /pets
```

### Request

```json
{
  "name": "Rocky",
  "breed": "Labrador",
  "age": 3
}
```

### Response

```json
{
  "message": "Mascota creada correctamente"
}
```

*(Ejemplo)*

---

## Obtener Mascotas del Usuario

```
GET /pets
```

### Response

```json
[
  {
    "id": 1,
    "name": "Rocky",
    "breed": "Labrador",
    "age": 3
  }
]
```

*(Ejemplo)*

---

## Editar Mascota

```
PATCH /pets/:id
```

### Request

```json
{
  "name": "Rocky Jr."
}
```

### Response

```json
{
  "message": "Mascota actualizada"
}
```

*(Ejemplo)*

---

# 7. Sistema de Match

El sistema permite que los usuarios interactúen con perfiles de mascotas mediante un sistema de **match**.

## Dar Huesito (Like)

```
POST /match/like
```

### Request

```json
{
  "petId": 10
}
```

---

## Saltar Perfil

```
POST /match/next
```

### Request

```json
{
  "petId": 10
}
```

*(Ejemplo de endpoint)*

---

# 8. Sistema de Mensajería

Los usuarios pueden comunicarse cuando se genera un **match entre mascotas**.

## Enviar Mensaje

```
POST /messages
```

### Request

```json
{
  "matchId": 2,
  "content": "Hola, nuestras mascotas podrían jugar juntas."
}
```

### Response

```json
{
  "message": "Mensaje enviado"
}
```

*(Ejemplo)*

---

## Obtener Mensajes

```
GET /messages/:matchId
```

### Response

```json
[
  {
    "senderId": 1,
    "content": "Hola!"
  }
]
```

*(Ejemplo)*

---

# 9. Códigos de Respuesta HTTP

| Código | Significado |
|------|-------------|
| 200 | Solicitud exitosa |
| 201 | Recurso creado correctamente |
| 400 | Solicitud inválida |
| 401 | No autorizado |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

---

# 10. Pruebas de la API

La API puede probarse utilizando herramientas como:

| Herramienta | Uso |
|-------------|-----|
| Postman | Pruebas manuales de endpoints |
| Insomnia | Cliente REST alternativo |
| Swagger (si se implementa) | Documentación automática de la API |

Ejemplo de ejecución del backend:

```bash
npm run start:dev
```

Una vez iniciado el servidor, la API estará disponible en:

```
http://localhost:3000/api
```
# Users Schemas

Este documento describe los modelos de datos (schemas) utilizados en los endpoints relacionados con usuarios.

Estos schemas representan:

 - La estructura de datos del usuario

 - Los DTO utilizados en el registro

 - Los DTO utilizados en la autenticación

 - Las respuestas de autenticación

# Usuario

Representa un usuario registrado en el sistema.

## Propiedades

| Campo            | Tipo              | Descripción                                     |
| ---------------- | ----------------- | ----------------------------------------------- |
| id_usuario       | number            | Identificador único del usuario                 |
| nombre           | string            | Nombre completo del usuario                     |
| email            | string            | Correo electrónico del usuario                  |
| telefono         | string            | Número de teléfono                              |
| foto_perfil_url  | string            | URL de la foto de perfil del usuario            |
| cantidad_strikes | number            | Número de intentos fallidos de inicio de sesión |
| fecha_registro   | string (datetime) | Fecha en que se registró el usuario             |
| esta_activo      | boolean           | Indica si la cuenta está activa                 |
| rol              | object            | Rol asignado al usuario                         |

### Ejemplo

``` json
{
  "id_usuario": 1,
  "nombre": "Luis Salazar",
  "email": "luis@email.com",
  "telefono": "77777777",
  "foto_perfil_url": "https://example.com/foto.jpg",
  "cantidad_strikes": 0,
  "fecha_registro": "2026-03-15T12:00:00.000Z",
  "esta_activo": true,
  "rol": {
    "id_rol": 1
  }
}
```

# CreateUsuarioDto

Schema utilizado para registrar un nuevo usuario en el sistema.

## Propiedades

| Campo           | Tipo   | Obligatorio | Descripción                 |
| --------------- | ------ | ----------- | --------------------------- |
| nombre          | string | Sí          | Nombre completo del usuario |
| email           | string | Sí          | Correo electrónico único    |
| contrasena_hash | string | Sí          | Contraseña del usuario      |
| telefono        | string | Sí          | Número de teléfono          |

### Ejemplo

``` json
{
  "nombre": "Carlos Perez",
  "email": "carlos@email.com",
  "contrasena_hash": "123456",
  "telefono": "76543210"
}
```

# LoginUsuarioDto

Schema utilizado para autenticación de usuarios.

## Propiedades

| Campo      | Tipo   | Obligatorio | Descripción                    |
| ---------- | ------ | ----------- | ------------------------------ |
| email      | string | Sí          | Correo electrónico del usuario |
| contrasena | string | Sí          | Contraseña del usuario         |

### Ejemplo

``` json
{
  "email": "usuario@email.com",
  "contrasena": "123456"
}
```

# AuthResponse

Schema de respuesta cuando el login es exitoso.

## Propiedades

| Campo        | Tipo   | Descripción                                    |
| ------------ | ------ | ---------------------------------------------- |
| access_token | string | Token JWT generado después de la autenticación |

### Ejemplo

``` json
{
  "access_token": "JWT_TOKEN"
}
```


# Users API

Documentación de los endpoints relacionados con la gestión de usuarios.

---

# POST /usuarios/registro

## Descripción

Este endpoint permite registrar un nuevo usuario en el sistema con el rol **Dueño**.

Durante el registro:

- Se valida que el correo electrónico no esté registrado.
- La contraseña se **encripta utilizando bcrypt** antes de guardarse en la base de datos.
- El usuario se crea con **rol dueño (id_rol = 1)**.
- La contraseña **no se devuelve en la respuesta**.

---

## Swagger Decorators

```ts
@ApiTags('usuarios')

@ApiOperation({ summary: 'Registrar nuevo usuario dueño' })

@ApiBody({ type: CreateUsuarioDto })

@ApiResponse({
  status: 201,
  description: 'Usuario registrado correctamente'
})

@ApiResponse({
  status: 409,
  description: 'El correo electrónico ya está en uso'
})

@ApiResponse({
  status: 500,
  description: 'Error interno del servidor'
})
```

### Request Body

```json
{
  "nombre": "Luis Salazar",
  "email": "luis@email.com",
  "contrasena_hash": "123456",
  "telefono": "77777777"
}
```

### Response Codes

| Código | Descripción                              |
| ------ | ---------------------------------------- |
| 201    | Usuario registrado correctamente         |
| 409    | El correo electrónico ya está registrado |
| 500    | Error interno del servidor               |

## Error Responses

### Correo duplicado

```json
{
  "statusCode": 409,
  "message": "El correo electrónico ya está en uso",
  "error": "Conflict"
}
```

## Ejemplos

### Ejemplo de Request

```json
{
  "nombre": "Carlos Perez",
  "email": "carlos@email.com",
  "contrasena_hash": "123456",
  "telefono": "76543210"
}
```

### Ejemplo de Response

```json
{
  "id_usuario": 5,
  "nombre": "Carlos Perez",
  "email": "carlos@email.com",
  "telefono": "76543210",
  "cantidad_strikes": 0,
  "esta_activo": true,
  "fecha_registro": "2026-03-15T12:00:00.000Z"
}
```

# POST /usuarios/login
## Descripción

Este endpoint permite autenticar un usuario en el sistema.

Durante el proceso de autenticación:

 - Se validan las credenciales del usuario.

 - Se verifica si la cuenta está activa.

 - Si la contraseña es incorrecta se incrementa el contador de intentos fallidos (strikes).

 - Después de 5 intentos fallidos, la cuenta se bloquea automáticamente.

 - Si el login es exitoso se genera un JWT (JSON Web Token).

## Swagger Decorators

``` ts
@ApiTags('usuarios')

@ApiOperation({ summary: 'Autenticación de usuario' })

@ApiBody({ type: LoginUsuarioDto })

@ApiResponse({
  status: 200,
  description: 'Autenticación exitosa'
})

@ApiResponse({
  status: 401,
  description: 'Credenciales inválidas o cuenta bloqueada'
})
```

## Request Body

``` json
{
  "email": "usuario@email.com",
  "contrasena": "123456"
}
```

## Response Codes

| Código | Descripción            |
| ------ | ---------------------- |
| 200    | Login exitoso          |
| 401    | Credenciales inválidas |
| 401    | Cuenta bloqueada       |

## Error Responses

### Credenciales incorrectas

``` json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized"
}
```

### Cuenta bloqueada

``` json
{
  "statusCode": 401,
  "message": "Cuenta bloqueada. Contacte al administrador.",
  "error": "Unauthorized"
}
```

## Ejemplos

### Ejemplo de Request

``` json
{
  "email": "carlos@email.com",
  "contrasena": "123456"
}
```

### Ejemplo de Response

``` json
{
  "access_token": "JWT_TOKEN"
}
```

# Reglas de Seguridad

 - Las contraseñas se almacenan utilizando bcrypt.

 - Después de 5 intentos fallidos, la cuenta se bloquea automáticamente.

 - Si el usuario inicia sesión correctamente, el contador de strikes se reinicia.

 - El sistema utiliza JWT (JSON Web Token) para autenticar peticiones posteriores.

# Pets API

API encargada de gestionar los perfiles de mascotas dentro del sistema.

Permite: - Registrar mascotas - Consultar mascotas - Actualizar
información - Eliminar perfiles

Base path:

/pets

------------------------------------------------------------------------

# Modelo de Datos

## Pet

  Campo               Tipo     Descripción
  ------------------- -------- -----------------------------------
  id_mascota          number   Identificador único de la mascota
  nombre              string   Nombre de la mascota
  raza                string   Raza de la mascota
  tamano              string   Tamaño de la mascota
  edad                number   Edad de la mascota
  genero              string   Género de la mascota
  estado_salud        string   Estado de salud
  vacuna_imagen_url   string   URL de imagen de vacunas
  fecha_registro      Date     Fecha de registro
  id_usuario          number   Usuario propietario

------------------------------------------------------------------------

# Endpoints

------------------------------------------------------------------------

# Crear mascota

POST /pets

Registra una nueva mascota asociada a un usuario.

## Swagger Decorators

```ts
@ApiTags('pets')

@ApiOperation({ summary: 'Crear una nueva mascota' })

@ApiBody({ type: CreatePetDto })

@ApiResponse({
  status: 201,
  description: 'Mascota creada correctamente'
})

@ApiResponse({ 
  status: 400, 
  description: 'Has alcanzado el límite máximo de 20 mascotas' 
})
```

------------------------------------------------------------------------

## Request Body

``` json
{ 
  "nombre": "Firulais", 
  "raza": "Labrador", 
  "tamano": "Grande", 
  "edad": 3, 
  "genero": "Macho", 
  "estado_salud": "Saludable", 
  "vacuna_imagen_url": "https://imagen.com/vacuna.jpg", 
  "id_usuario": "1"
}
```

------------------------------------------------------------------------

## Ejemplo 1

``` json
{ 
  "nombre": "Firulais", 
  "raza": "Labrador", 
  "tamano": "Grande", 
  "edad": 3, 
  "genero": "Macho", 
  "estado_salud": "Saludable", 
  "vacuna_imagen_url": "https://img.com/vacuna1.jpg", 
  "id_usuario": "1" 
}
```

## Ejemplo 2

``` json
{ 
  "nombre": "Luna", 
  "raza": "Poodle", 
  "tamano": "Pequeño", 
  "edad": 2,
  "genero": "Hembra", 
  "estado_salud": "Vacunada", 
  "vacuna_imagen_url": "https://img.com/vacuna2.jpg", 
  "id_usuario": "2" 
}
```

------------------------------------------------------------------------

## Response Codes

  Código   |  Descripción
  -------- |------------------------------------
  201      | Mascota creada correctamente
  400      | Datos inválidos o límite alcanzado

------------------------------------------------------------------------

## Response Exitosa

``` json
{ 
  "id_mascota": 5, 
  "nombre": "Firulais", 
  "raza": "Labrador", 
  "tamano": "Grande", 
  "edad": 3, 
  "genero": "Macho", 
  "estado_salud": "Saludable",
  "vacuna_imagen_url": "https://imagen.com/vacuna.jpg",
  "fecha_registro" : "2026-03-15T10:22:31.000Z", 
  "id_usuario": 1 
}
```

------------------------------------------------------------------------

## Error Response

### Límite de mascotas alcanzado

``` json
{ 
  "statusCode": 400, 
  "message": "Has alcanzado el límite máximo de 20 mascotas", 
  "error": "Bad Request" 
}
```

------------------------------------------------------------------------

# Obtener mascotas por usuario

GET /pets/user/{id}

Obtiene todas las mascotas asociadas a un usuario.

------------------------------------------------------------------------

## Swagger Decorators

``` ts
@ApiOperation({ summary: 'Obtener mascotas por usuario' }) 

@ApiParam({
  name: 'id', 
  description: 'ID del usuario' 
})

@ApiResponse({ 
  status: 200,
  description: 'Lista de mascotas' 
}) 

@ApiResponse({ 
  status: 404,
  description: 'Usuario no encontrado' 
})
```

------------------------------------------------------------------------

## Parámetros

  Parámetro   |  Tipo    |  Descripción
  ----------- | -------- | ----------------
  id          |  number  |  ID del usuario

------------------------------------------------------------------------

## Ejemplo 1

``` json
\[ 
  { 
  
    "id_mascota": 1, 
    "nombre": "Firulais", 
    "raza": "Labrador",
    "tamano": "Grande", 
    "edad": 3, 
    "genero": "Macho", 
    "estado_salud": "Saludable", 
    "fecha_registro": "2026-03-15T10:22:31.000Z", 
    "id_usuario":1 
  }
\]
```

## Ejemplo 2

``` json
\[ 
  { 
    "id_mascota": 2, 
    "nombre": "Luna", 
    "raza": "Poodle", 
    "tamano": "Pequeño", 
    "edad": 2, 
    "genero": "Hembra", 
    "estado_salud": "Vacunada",
    "fecha_registro": "2026-03-16T11:10:20.000Z", 
    "id_usuario": 2 
  }, 
  {
    "id_mascota": 3, 
    "nombre": "Max", 
    "raza": "Bulldog", 
    "tamano":"Mediano", 
    "edad": 4, 
    "genero": "Macho", 
    "estado_salud": "Saludable",
    "fecha_registro": "2026-03-16T11:10:20.000Z", 
    "id_usuario": 2 
  }
\]
```

------------------------------------------------------------------------

# Obtener todas las mascotas

GET /pets

## Swagger Decorators

``` ts
@ApiOperation({ summary: 'Obtener todas las mascotas registradas' })

@ApiResponse({ 
  status: 200, 
  description: 'Lista completa de mascotas' 
})
``` 
------------------------------------------------------------------------

## Ejemplo 1

``` json
\[ 
  { 
    "id_mascota": 1, 
    "nombre": "Firulais", 
    "raza": "Labrador" 
  }
\]
```

## Ejemplo 2

``` json
\[ 
  { 
    "id_mascota": 1, 
    "nombre": "Firulais" 
  }, 
  { 
    "id_mascota": 2,
    "nombre": "Luna" 
  }
\]
```

------------------------------------------------------------------------

# Actualizar mascota

PATCH /pets/{id}

## Swagger Decorators

``` ts
@ApiOperation({ summary: 'Actualizar información de una mascota' })

@ApiParam({ name: 'id', description: 'ID de la mascota' })

@ApiResponse({ 
  status: 200, 
  description: 'Mascota actualizada correctamente' 
})

@ApiResponse({ 
  status: 404, 
  description: 'Mascota no encontrada' 
})
```

------------------------------------------------------------------------

## Ejemplo 1

``` json
{ 
  "nombre": "Firulais actualizado", 
  "edad": 4 
}
```

## Ejemplo 2

``` json
{ 
  "estado_salud": "En tratamiento", 
  "edad": 5 
}
```

------------------------------------------------------------------------

## Response Exitosa

``` json
{ 
  "id_mascota": 1, 
  "nombre": "Firulais actualizado", 
  "edad": 4 
}
```

------------------------------------------------------------------------

# Eliminar mascota

DELETE /pets/{id}

## Swagger Decorators

``` ts
@ApiOperation({ summary: 'Eliminar mascota' }) 

@ApiParam({ 
  name: 'id',
  description: 'ID de la mascota' 
}) 

@ApiResponse({ 
  status: 200,
  description: 'Mascota eliminada correctamente' 
}) 

@ApiResponse({ 
  status: 404, 
  description: 'Mascota no encontrada' 
})
```

------------------------------------------------------------------------

## Ejemplo 1

``` json
{ 
  "message": "Mascota eliminada correctamente" 
}
```

## Ejemplo 2

``` json
{ 
  "message": "Mascota no encontrada" 
}
```

------------------------------------------------------------------------

# Reglas de Negocio

-   Cada mascota pertenece a un usuario.
-   Un usuario puede registrar máximo 20 mascotas.
-   Si el usuario supera el límite, el sistema devuelve error 400 Bad
    Request.
-   La fecha de registro se genera automáticamente.

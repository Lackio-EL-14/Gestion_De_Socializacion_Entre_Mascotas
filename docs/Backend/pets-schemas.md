# Schemas - Pets API

Este documento describe los **schemas utilizados en la API** siguiendo
la estructura de OpenAPI / Swagger.

------------------------------------------------------------------------

## Pet

Representa una mascota registrada en el sistema.

  Campo               | Tipo                | Descripción
  ------------------- | ------------------- | ---------------------------
  id_mascota          | integer             | Identificador único de la mascota
  nombre              | string              | Nombre de la mascota
  raza                | string              | Raza de la mascota
  tamano              | string              | Tamaño de la mascota
  edad                | integer             | Edad
  genero              | string              | Género
  estado_salud        | string              | Estado de salud
  vacuna_imagen_url   | string              | URL de imagen de vacunas
  fecha_registro      | string(date-time)   | Fecha de registro
  id_usuario          | integer             | Usuario propietario

------------------------------------------------------------------------

## CreatePetDto

Schema utilizado para **crear una mascota**.

``` json
{
  "nombre": "string",
  "raza": "string",
  "tamano": "string",
  "edad": 3,
  "genero": "string",
  "estado_salud": "string",
  "vacuna_imagen_url": "string",
  "id_usuario": 1
}
```

Campos requeridos:

-   nombre
-   raza
-   tamano
-   edad
-   genero
-   estado_salud
-   id_usuario

------------------------------------------------------------------------

## UpdatePetDto

Schema utilizado para **actualizar una mascota**.

Todos los campos son opcionales.

``` json
{
  "nombre": "string",
  "raza": "string",
  "tamano": "string",
  "edad": 3,
  "genero": "string",
  "estado_salud": "string",
  "vacuna_imagen_url": "string",
  "id_usuario": 1
}
```

------------------------------------------------------------------------

## ErrorResponse

Formato de respuesta cuando ocurre un error.

``` json
{
  "statusCode": 400,
  "message": "Has alcanzado el límite máximo de 20 mascotas",
  "error": "Bad Request"
}
```

------------------------------------------------------------------------

## DeleteResponse

Respuesta cuando una mascota se elimina correctamente.

``` json
{
  "message": "Mascota eliminada correctamente"
}
```

# DogChat Database

Este documento describe la estructura y configuración de la base de datos del sistema **DogChat**.

La base de datos es responsable del almacenamiento, organización y gestión de la información necesaria para el funcionamiento del sistema, incluyendo usuarios, perfiles de mascotas e interacciones dentro de la plataforma.

---

# 1. Motor de Base de Datos

El sistema utiliza **MariaDB** como motor de base de datos relacional.

| Tecnología | Versión |
|------------|--------|
| MariaDB | 11.8.3 |

MariaDB fue seleccionado por:

- Su alto rendimiento
- Compatibilidad con MySQL
- Facilidad de integración con TypeORM
- Soporte para aplicaciones escalables

---

# 2. ORM Utilizado

Para la interacción entre el backend y la base de datos se utiliza **TypeORM**.

TypeORM permite mapear las tablas de la base de datos a **clases de TypeScript**, facilitando el manejo de datos sin necesidad de escribir consultas SQL manualmente.

Características principales:

- Uso de **decoradores**
- Mapeo objeto-relacional
- Manejo de entidades
- Soporte para migraciones
- Integración directa con NestJS

Ejemplo básico de entidad:

```ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

}

```

Ejemplo de entidad

# 3. Configuración de Conexión

La conexión con la base de datos se realiza mediante variables de entorno.

Ejemplo de configuración:

```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=dogchat
```

Valores mostrados como ejemplo.

# 4. Modelo de Datos

El sistema maneja diferentes entidades principales que representan los datos del sistema.

Principales entidades:

| Entidad |	Descripción |
|------|------|
| User |	Representa a los usuarios dueños de mascotas |
| Pet |	Información de las mascotas |
| Match |	Relación entre mascotas que han generado un match |
| Message |	Mensajes enviados entre usuarios |

Las entidades mostradas son ejemplos y pueden variar según la implementación final.

# 5. Relaciones entre Entidades

Ejemplo de relaciones dentro del sistema:

| Entidad | Relación	| Entidad |
|------|------|------|
| User	| 1:N	| Pet |
| Pet |	N:N |	Match |
| User |	1:N |	Message |

Esto permite modelar interacciones entre usuarios y sus mascotas dentro de la plataforma.

# 6. Ejemplo de Entidad Pet
```TypeScript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity()
export class Pet {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  breed: string;

  @Column()
  age: number;

}
```

Ejemplo de entidad.

# 7. Operaciones de Base de Datos

La base de datos permite realizar las siguientes operaciones principales:

Create → creación de registros

Read → consulta de información

Update → actualización de datos

Delete → eliminación de registros

Estas operaciones son gestionadas por TypeORM a través del backend NestJS.

# 8. Migraciones

TypeORM permite gestionar cambios en la estructura de la base de datos mediante migraciones.

Ejemplo de comandos:

```Bash

npm run typeorm migration:generate
npm run typeorm migration:run

```

Los comandos pueden variar según la configuración del proyecto.

# 9. Integridad de Datos

Para garantizar la integridad de la información se utilizan:

- Claves primarias

- Relaciones entre entidades

- Restricciones de datos

- Validaciones en el backend

Estas medidas ayudan a mantener consistencia dentro de la base de datos.

# 10. Herramientas de Gestión
| Herramienta |	Uso |
|------|------|
| MariaDB |	Motor de base de datos |
| TypeORM |	ORM para acceso a datos |
| NestJS |	Backend que gestiona las operaciones |
| GitHub |	Control de versiones del esquema y migraciones |


# DogChat Backend

Backend del sistema **DogChat**, encargado de gestionar la lógica de negocio, autenticación de usuarios, interacción entre perfiles de mascotas y comunicación con la base de datos.

El backend expone una **API REST** consumida por el frontend desarrollado en Angular.

---

# 1. Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| Node.js v20 (LTS) | Entorno de ejecución |
| NestJS 10.x | Framework backend |
| TypeScript | Lenguaje principal |
| TypeORM | ORM para manejo de base de datos |
| MariaDB 11.8.3 | Motor de base de datos |
| Git / GitHub | Control de versiones |
| Postman | Pruebas de API |

---

# 2. Arquitectura del Backend

El backend sigue una arquitectura modular basada en **NestJS**, inspirada en principios de **Clean Architecture**.

Cada funcionalidad del sistema se organiza en **módulos independientes**.

Estructura principal:

- **Controllers**
  - Manejan las rutas HTTP
  - Reciben las solicitudes del frontend

- **Services**
  - Contienen la lógica de negocio

- **Entities**
  - Representan las tablas de la base de datos

- **DTOs**
  - Definen la estructura de datos que se envía y recibe

---

# 3. Estructura del Proyecto

Ejemplo de estructura del backend:
backend
│
├── src
│
│ ├── modules
│ │ ├── auth
│ │ ├── users
│ │ ├── pets
│ │ ├── matches
│ │ └── messages
│ ├── controllers
│ ├── services
│ ├── entities
│ ├── dto
│ ├── config
│ └── main.ts
│
├── package.json
└── tsconfig.json


---

# 4. Configuración del Entorno

El backend utiliza variables de entorno para la configuración del sistema.

Ejemplo de archivo `.env`:

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=dogchat

JWT_SECRET=example_secret
PORT=3000


*(Los valores anteriores son ejemplos.)*

---

# 5. Instalación

Instalar dependencias:

```bash
npm install

```

# 6. Ejecución del Servidor

Modo desarrollo:

```bash
npm run start:dev
```
Modo producción:

```bash
npm run build
npm run start
```
# 7. Endpoints Principales

## Autenticación

| Método | Endpoint | Descripción |
|------|------|------|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesión |

---

## Usuarios

| Método | Endpoint | Descripción |
|------|------|------|
| GET | `/users` | Obtener lista de usuarios |
| GET | `/users/:id` | Obtener usuario específico |
| PATCH | `/users/:id` | Actualizar usuario |

> Estos endpoints son **ejemplos** y pueden variar según la implementación final.

---

## Mascotas

| Método | Endpoint | Descripción |
|------|------|------|
| POST | `/pets` | Crear perfil de mascota |
| GET | `/pets` | Obtener mascotas |
| PATCH | `/pets/:id` | Editar perfil de mascota |

> Endpoints de ejemplo.

---

# 8. Entidades Principales

Las entidades representan las **tablas de la base de datos** mediante TypeORM.

## User

Ejemplo de entidad:

```ts
@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

}
```
# 9. Extras generados automaticamente

## TESTING

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

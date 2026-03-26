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
# 9. Sistema de Telemetría y Auditoría de Dogchat

Este documento detalla la arquitectura de logging implementada en el backend de Dogchat, diseñada para proveer observabilidad, análisis forense y trazabilidad en entornos de desarrollo y producción en la nube.

## 1. Justificación Técnica: ¿Por qué Winston?

Para el sistema de telemetría de Dogchat, se evaluaron tres de las librerías más estandarizadas en el ecosistema Node.js: **Morgan**, **Pino** y **Winston**. La elección de Winston se fundamenta en los siguientes criterios arquitectónicos:

* **Frente a Morgan:** Morgan es un "HTTP Request Logger". Aunque excelente para registrar qué rutas se consumen, carece de la capacidad de inyectarse en la lógica de negocio (Servicios) para registrar eventos internos (ej. una falla en la validación de un hash Bcrypt). Winston es un "Application Logger" completo.
* **Frente a Pino:** Pino prioriza el rendimiento extremo y emite logs exclusivamente en formato JSON por defecto, lo que dificulta la lectura humana durante la etapa de desarrollo local sin herramientas de transformación adicionales.
* **La Ventaja Competitiva de Winston (Transportes):** Winston utiliza una arquitectura basada en **Transportes (Transports)**. Esto nos permite enrutar un mismo log a múltiples destinos con formatos distintos de manera simultánea. Podemos tener logs formateados y coloreados en la terminal para el equipo de desarrollo, y paralelamente generar archivos JSON estructurados para auditorías, todo con una sola línea de código.

## 2. Comportamiento en Entornos Cloud (Despliegue)



Los servidores en la nube (Render, Railway, AWS) utilizan contenedores efímeros. Si el logger únicamente escribiera en archivos locales (`.log`), el historial se destruiría cada vez que el servidor se reinicie. 

Para solucionar esto, nuestra configuración de Winston emite logs estructurados hacia la salida estándar (Console/Stdout). Las plataformas Cloud modernas interceptan automáticamente este flujo y lo almacenan en sus propios paneles de persistencia. Esto garantiza que el historial del equipo esté siempre accesible, centralizado y a salvo de reinicios del contenedor.

*(Nota: Localmente se generará una carpeta `/logs` para desarrollo, la cual ya se encuentra en el `.gitignore` para proteger información sensible).*

## 3. Guía de Uso para el Equipo Backend

El logger ha sido inyectado globalmente y reemplaza al logger por defecto de NestJS. Para utilizarlo en cualquier Servicio o Controlador, se debe instanciar la clase nativa `Logger` de NestJS.

### Configuración en tu archivo:
\`\`\`typescript
import { Logger } from '@nestjs/common';

export class TuServicio {
  // Inyectamos el contexto (el nombre de la clase) para saber de dónde viene el error
  private readonly logger = new Logger(TuServicio.name);
}
\`\`\`

### Taxonomía y Niveles de Severidad:
Es estrictamente necesario utilizar el nivel adecuado según el evento:

* **\`this.logger.log('Mensaje')\`**: Para operaciones exitosas del *Happy Path*.
  * *Ejemplo:* \`[AUDIT-PETS] Entidad mascota creada exitosamente.\`
* **\`this.logger.warn('Mensaje')\`**: Para anomalías, intentos fallidos o comportamientos sospechosos que no detienen el sistema pero requieren atención.
  * *Ejemplo:* \`[AUDIT-AUTH] Intento de intrusión por fuerza bruta.\`
* **\`this.logger.error('Mensaje', trace)\`**: Exclusivo para caídas del sistema, excepciones no controladas o fallos de base de datos (Errores 500).
  * *Ejemplo:* \`[ERROR-DB] Conexión perdida con el cluster Aiven.\`
* **\`this.logger.debug('Mensaje')\`**: Información detallada temporal útil solo para el desarrollador cazando un bug.


# 10. Extras generados automaticamente

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

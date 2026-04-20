"""# 🛡️ DogChat: Documentación del Microservicio de Administración (Admin-Service)

Esta documentación técnica detalla el funcionamiento del módulo de administración, el sistema de moderación y la arquitectura de seguridad distribuida entre NestJS y Spring Boot.

---

## 🔑 1. Arquitectura de Seguridad y Login

El sistema utiliza una arquitectura de **Seguridad Centralizada con Secreto Compartido**. Aunque existen dos servidores independientes, ambos confían en la misma firma criptográfica.

### El Flujo de Autenticación
1. **Punto de Entrada:** El administrador inicia sesión en `http://localhost:3000/usuarios/admin/login` (NestJS).
2. **Validación de Rol:** El servidor de NestJS no solo valida la contraseña, sino que verifica que el usuario pertenezca al **Rol 2 (Administrador)**.
3. **Generación de JWT:** Se genera un Token JWT firmado con la llave maestra: `super-secreto-dogchat-2026-seguro`.
4. **Consumo de Servicios:** Para cada petición hacia Java (Spring Boot), el cliente debe enviar el token. Java utiliza la misma llave para validar la firma sin necesidad de consultar a NestJS.

### Configuración Técnica en Java
* **Módulo:** `spring-boot-starter-oauth2-resource-server`.
* **Validación:** Se decodifica mediante `NimbusJwtDecoder` usando el algoritmo **HS256**.
* **Filtro:** Se ha implementado un `SecurityFilterChain` que bloquea por defecto cualquier petición que no incluya un `Bearer Token` válido.

---

## ⚖️ 2. Sistema de Moderación y Reportes (HU-01)

Este módulo permite a los administradores gestionar el comportamiento de la comunidad y sancionar a los usuarios infractores.

### Lógica de Penalizaciones
El sistema maneja un esquema de sanciones acumulativas automatizadas:

1.  **PENALIZAR (Strike):** * Incrementa el contador `cantidad_strikes` del usuario reportado en +1.
    * Si el contador llega a **3 strikes**, el sistema cambia automáticamente el estado `esta_activo` del usuario a `false` (Baneo Automático).
2.  **BANEO_DIRECTO:** * Se utiliza para faltas graves.
    * Cambia inmediatamente `esta_activo` a `false`, ignorando el conteo de strikes.
3.  **IGNORAR:** * Marca el reporte como resuelto pero no aplica cambios al usuario.

---

## 📡 3. Contrato de API (Endpoints)

| Método | Endpoint | Descripción | Seguridad |
| :--- | :--- | :--- | :--- |
| `POST` | `/usuarios/admin/login` | Login de administrador (Puerto 3000) | Público |
| `GET` | `/api/admin/reportes/pendientes` | Lista de reportes sin resolver | JWT Obligatorio |
| `POST` | `/api/admin/reportes/{id}/procesar` | Ejecutar acción (BANEO/PENALIZAR) | JWT Obligatorio |

### Ejemplo de Body para Procesar Reporte:
```json
{
  "idAdmin": 93,
  "accion": "BANEO_DIRECTO"
}

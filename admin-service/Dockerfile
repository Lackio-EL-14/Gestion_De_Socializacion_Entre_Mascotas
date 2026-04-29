# Fase 1: Construcción
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copia archivos esenciales
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Permisos y caché de dependencias
RUN chmod +x mvnw
# Usamos "clean" antes para asegurar un entorno puro
RUN ./mvnw dependency:go-offline -B

# Copia el código y compila
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Fase 2: Ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render necesita que el contenedor escuche en el puerto que asignamos
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
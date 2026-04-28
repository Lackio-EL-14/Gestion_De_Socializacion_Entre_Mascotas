# Fase 1: Construcción
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copia los archivos de configuración de Maven
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Asegura permisos de ejecución y descarga dependencias
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

# Copia el código fuente y construye el jar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Fase 2: Ejecución
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
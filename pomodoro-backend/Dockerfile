# --- Stage 1: build the jar with Maven ---
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy just the pom first so dependencies are cached between builds
COPY pom.xml .
RUN mvn -B dependency:go-offline

# Now copy the source and build
COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Stage 2: run the jar on a small JRE-only image ---
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/backend-1.0.0.jar app.jar

# Render sets $PORT at runtime; the app already reads it via application.properties
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

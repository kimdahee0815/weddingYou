FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

# Only copy what's needed to run mvnw (faster builds with caching)
COPY backend/.mvn/ backend/.mvn
COPY backend/mvnw backend/pom.xml backend/

# Make sure mvnw is executable
RUN chmod +x backend/mvnw

# Download dependencies (cached if pom.xml unchanged)
RUN cd backend && ./mvnw dependency:go-offline

# Now copy the full source
COPY backend /app/backend

# Build the app
RUN cd backend && ./mvnw clean package -DskipTests


# ---------- Runtime Stage ----------
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the built JAR
COPY --from=build /app/backend/target/*.jar app.jar

# Create upload directories
RUN mkdir -p /Project/profileImg/user \
    && mkdir -p /Project/profileImg/planner \
    && mkdir -p /Project/itemImg

RUN chmod -R 777 /Project

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
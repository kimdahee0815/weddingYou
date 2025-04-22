FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

# Copy mvnw and related files first for layer caching
COPY backend/.mvn /app/backend/.mvn
COPY backend/mvnw /app/backend/mvnw
COPY backend/pom.xml /app/backend/pom.xml

# Make mvnw executable
RUN chmod +x /app/backend/mvnw

# Set JAVA_HOME manually
ENV JAVA_HOME=/opt/java/openjdk

# Go offline (optional but useful for caching dependencies)
RUN cd backend && ./mvnw dependency:go-offline

# Now copy the rest of the source code
COPY backend /app/backend

# Build the application
RUN cd backend && ./mvnw clean package -DskipTests


FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar

RUN mkdir -p /Project/profileImg/user \
    && mkdir -p /Project/profileImg/planner \
    && mkdir -p /Project/itemImg \
    && chmod -R 777 /Project

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
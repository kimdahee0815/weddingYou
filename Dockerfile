FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

COPY ./backend /app/backend

WORKDIR /app/backend

RUN apt-get update && apt-get install -y dos2unix \
    && dos2unix mvnw \
    && chmod +x mvnw \
    && ./mvnw -v

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

RUN mkdir -p /Project/profileImg/user \
    && mkdir -p /Project/profileImg/planner \
    && mkdir -p /Project/itemImg \
    && chmod -R 777 /Project

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

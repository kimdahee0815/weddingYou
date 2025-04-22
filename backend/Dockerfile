FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

ENV JAVA_HOME=/usr/local/openjdk-17
ENV PATH="$JAVA_HOME/bin:$PATH"

COPY . .

WORKDIR /app/backend

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

RUN mkdir -p /Project/profileImg/user \
    && mkdir -p /Project/profileImg/planner \
    && mkdir -p /Project/itemImg \
    && chmod -R 777 /Project

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
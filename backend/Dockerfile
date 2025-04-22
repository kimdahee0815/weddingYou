FROM maven:3.8.7-eclipse-temurin-17 as build

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Create directories for file uploads
RUN mkdir -p /Project/profileImg/user \
    && mkdir -p /Project/profileImg/planner \
    && mkdir -p /Project/itemImg

# Set permissions
RUN chmod -R 777 /Project

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
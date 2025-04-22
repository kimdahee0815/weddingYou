FROM maven:3.8.7-eclipse-temurin-17 AS build

WORKDIR /app

# Copy wrapper scripts first
COPY backend/.mvn /app/backend/.mvn
COPY backend/mvnw /app/backend/mvnw
COPY backend/pom.xml /app/backend/pom.xml

# Make mvnw executable
RUN chmod +x /app/backend/mvnw

# Set JAVA_HOME correctly based on actual JDK location
ENV JAVA_HOME=/usr/local/openjdk-17
ENV PATH=$JAVA_HOME/bin:$PATH

# Optional: Go offline first (caching dependencies)
RUN cd backend && ./mvnw dependency:go-offline

# Copy source and build
COPY backend /app/backend
RUN cd backend && ./mvnw clean package -DskipTests
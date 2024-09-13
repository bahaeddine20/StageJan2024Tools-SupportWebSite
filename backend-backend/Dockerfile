# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the jar file from the target directory to the container
COPY target/spring-boot-security-jwt-0.0.1-SNAPSHOT.jar app.jar

# Expose the port on which the application will run
EXPOSE 8080

# Set the entry point command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]



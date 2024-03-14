
FROM openjdk:8
EXPOSE 8089
WORKDIR /ActiaES
COPY target/backend.jar /ActiaES/backend.jar
ENTRYPOINT ["java", "-jar", "backend.jar"]
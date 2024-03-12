
FROM openjdk:17
EXPOSE 9091
WORKDIR /ActiaES
COPY target/backend.jar /ActiaES/backend.jar
ENTRYPOINT ["java", "-jar", "backend.jar"]
FROM openjdk:17
EXPOSE 9091
WORKDIR /ActiaES
COPY Back/target/backend.jar /ActiaES/backend.jar
ENTRYPOINT ["java", "-jar", "backend.jar"]

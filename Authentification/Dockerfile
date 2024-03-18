FROM openjdk:1.8
EXPOSE 8089
WORKDIR /ActiaES
COPY Authentification/target/backendAuth.jar /ActiaES/backendAuth.jar
ENTRYPOINT ["java", "-jar", "backendAuth.jar"]

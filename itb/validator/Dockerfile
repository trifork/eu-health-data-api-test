# syntax=docker/dockerfile:1
# Same REST server as OpenTestBed/itb-plugin-fhir-validator. The fork's wip
# release is mutable, so reject changed bytes until the pin is reviewed.
FROM eclipse-temurin:17-jre@sha256:2a996a534890f1bee252fab23a0c01e773e9e1dc0e4700e8f0f6a2697c6cbf76
WORKDIR /app
ADD --checksum=sha256:2c1f7a66dadaccd20e78114aa59a34ba1a3325999c44a1c04946d0d791e096ec https://github.com/costateixeira/org.hl7.fhir.core/releases/download/wip/validator_cli.jar /app/validator_cli.jar
ENV JAVA_TOOL_OPTIONS=-Xmx4g
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/validator_cli.jar"]
CMD ["server", "8080", "-version", "4.0", "-allowNetworkAccess"]

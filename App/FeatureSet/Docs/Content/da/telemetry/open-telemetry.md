# Integrer OpenTelemetry (logging, metrikker og traces) med Cast Operations.

### Trin 1 – Opret Telemetry Ingestion Token.

Når du har oprettet en Cast Operations-konto, kan du oprette et telemetriindtagelsestoken til at indsamle logs, metrikker og traces fra din applikation.

Når du har tilmeldt dig Cast Operations og oprettet et projekt, skal du klikke på "Mere" i navigationslinjen og klikke på "Projektindstillinger".

På siden Telemetry Ingestion Key skal du klikke på "Opret indtagelsesnøgle" for at oprette et token.

![Opret tjeneste](/docs/static/images/TelemetryIngestionKeys.png)

Når du har oprettet et token, skal du klikke på "Vis" for at se tokenet.

![Vis tjeneste](/docs/static/images/TelemetryIngestionKeyView.png)

### Trin 2

#### Konfigurer telemetritjenesten i din applikation.

#### Applikationslogs

Vi bruger OpenTelemetry til at indsamle applikationslogs. Cast Operations understøtter i øjeblikket logindtagelse fra disse OpenTelemetry SDK'er. Følg venligst instruktionerne for at konfigurere telemetritjenesten i din applikation.

- [C++](https://opentelemetry.io/docs/instrumentation/cpp/)
- [Go](https://opentelemetry.io/docs/instrumentation/go/)
- [Java](https://opentelemetry.io/docs/instrumentation/java/)
- [JavaScript / TypeScript / NodeJS / Browser](https://opentelemetry.io/docs/instrumentation/js/)
- [Python](https://opentelemetry.io/docs/instrumentation/python/)
- [Ruby](https://opentelemetry.io/docs/instrumentation/ruby/)
- [PHP](https://opentelemetry.io/docs/instrumentation/php/)
- [Erlang](https://opentelemetry.io/docs/instrumentation/erlang/)
- [Rust](https://opentelemetry.io/docs/instrumentation/rust/)
- [.NET / C#](https://opentelemetry.io/docs/instrumentation/net/)
- [Swift](https://opentelemetry.io/docs/instrumentation/swift/)

**Integrer med Cast Operations**

Når du har konfigureret telemetritjenesten i din applikation, kan du integrere med Cast Operations ved at indstille følgende miljøvariabler.

| Miljøvariabel               | Værdi                                          |
| --------------------------- | ---------------------------------------------- |
| OTEL_EXPORTER_OTLP_HEADERS  | x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN |
| OTEL_EXPORTER_OTLP_ENDPOINT | https://latticeruntime.com/otlp                     |
| OTEL_SERVICE_NAME           | NAME_OF_YOUR_SERVICE                           |

**Eksempel**

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=9c8806e0-a4aa-11ee-be95-010d5967b068
export OTEL_EXPORTER_OTLP_ENDPOINT=https://latticeruntime.com/otlp
export OTEL_SERVICE_NAME=my-service
```

**Selvhostet Cast Operations**

Hvis du selvhoster cast-operations, kan dette ændres til dit selvhostede OpenTelemetry Collector-endpoint (f.eks. `http(s)://YOUR-OPERATIONS-HOST/otlp`)

Når du kører din applikation, bør du se loggene på Cast Operations-telemetriservicesiden. Kontakt venligst support@latticeruntime.com, hvis du har brug for hjælp.

#### Brug af OpenTelemetry Collector

Du kan også bruge OpenTelemetry Collector i stedet for at sende telemetridata direkte fra din applikation.
Hvis du bruger OpenTelemetry Collector, kan du konfigurere Cast Operations-eksportøren i collector-konfigurationsfilen.

Her er eksempelkonfigurationen til OpenTelemetry Collector.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  # Eksporter over HTTP
  otlphttp:
    endpoint: "https://latticeruntime.com/otlp"
    # Kræver brug af JSON-encoder i stedet for standard Proto(buf)
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "CAST_OPERATIONS_TOKEN" # Dit Cast Operations-token

service:
  pipelines:
    traces:
      receivers: [otlp]
      exporters: [otlphttp]
    metrics:
      receivers: [otlp]
      exporters: [otlphttp]
    logs:
      receivers: [otlp]
      exporters: [otlphttp]
```

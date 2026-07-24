# OpenTelemetry (logboeken, metrics en traces) integreren met Cast Operations.

### Stap 1 - Telemetrie-ingestietoken aanmaken.

Zodra u een Cast Operations-account heeft aangemaakt, kunt u een telemetrie-ingestietoken aanmaken om logboeken, metrics en traces van uw applicatie te verwerken.

Nadat u zich hebt aangemeld bij Cast Operations en een project hebt aangemaakt, klikt u op "Meer" in de navigatiebalk en vervolgens op "Projectinstellingen".

Klik op de pagina Telemetrie-ingestiesleutel op "Ingestiesleutel aanmaken" om een token aan te maken.

![Dienst aanmaken](/docs/static/images/TelemetryIngestionKeys.png)

Zodra u een token hebt aangemaakt, klikt u op "Bekijken" om het token te bekijken.

![Dienst bekijken](/docs/static/images/TelemetryIngestionKeyView.png)

### Stap 2

#### De telemetriedienst configureren in uw applicatie.

#### Applicatielogboeken

We gebruiken OpenTelemetry om applicatielogboeken te verzamelen. Cast Operations ondersteunt momenteel logboekingestie vanuit deze OpenTelemetry SDK's. Volg de instructies om de telemetriedienst in uw applicatie te configureren.

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

**Integreren met Cast Operations**

Zodra u de telemetriedienst in uw applicatie hebt geconfigureerd, kunt u integreren met Cast Operations door de volgende omgevingsvariabelen in te stellen.

| Omgevingsvariabele          | Waarde                                         |
| --------------------------- | ---------------------------------------------- |
| OTEL_EXPORTER_OTLP_HEADERS  | x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN |
| OTEL_EXPORTER_OTLP_ENDPOINT | https://latticeruntime.com/otlp                     |
| OTEL_SERVICE_NAME           | NAME_OF_YOUR_SERVICE                           |

**Voorbeeld**

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=9c8806e0-a4aa-11ee-be95-010d5967b068
export OTEL_EXPORTER_OTLP_ENDPOINT=https://latticeruntime.com/otlp
export OTEL_SERVICE_NAME=my-service
```

**Zelf-gehoste Cast Operations**

Als u Cast Operations zelf host, kan dit worden gewijzigd naar uw eigen zelf-gehoste OpenTelemetry collector-eindpunt (bijv. `http(s)://YOUR-OPERATIONS-HOST/otlp`)

Zodra u uw applicatie uitvoert, zou u de logboeken moeten zien op de pagina van de Cast Operations-telemetriedienst. Neem contact op via support@latticeruntime.com als u hulp nodig heeft.

#### De OpenTelemetry Collector gebruiken

U kunt ook de OpenTelemetry Collector gebruiken in plaats van telemetriegegevens rechtstreeks vanuit uw applicatie te sturen.
Als u de OpenTelemetry Collector gebruikt, kunt u de Cast Operations-exporter configureren in het collectorconfiguratibestand.

Hier is de voorbeeldconfiguratie voor de OpenTelemetry Collector.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  # Exporteren via HTTP
  otlphttp:
    endpoint: "https://latticeruntime.com/otlp"
    # Vereist gebruik van JSON-encoder in plaats van standaard Proto(buf)
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "CAST_OPERATIONS_TOKEN" # Uw Cast Operations-token

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

# OpenTelemetry (Logging, Metriken und Traces) mit Cast Operations integrieren.

### Schritt 1 - Telemetrie-Ingestion-Token erstellen.

Sobald Sie ein Cast Operations-Konto erstellt haben, können Sie ein Telemetrie-Ingestion-Token erstellen, um Logs, Metriken und Traces aus Ihrer Anwendung zu importieren.

Nachdem Sie sich bei Cast Operations angemeldet und ein Projekt erstellt haben, klicken Sie in der Navigationsleiste auf „Mehr" und dann auf „Projekteinstellungen".

Klicken Sie auf der Seite Telemetrie-Ingestion-Schlüssel auf „Ingestion-Schlüssel erstellen", um ein Token zu erstellen.

![Service erstellen](/docs/static/images/TelemetryIngestionKeys.png)

Sobald Sie ein Token erstellt haben, klicken Sie auf „Anzeigen", um das Token einzusehen.

![Service anzeigen](/docs/static/images/TelemetryIngestionKeyView.png)

### Schritt 2

#### Telemetrie-Dienst in Ihrer Anwendung konfigurieren.

#### Anwendungs-Logs

Wir verwenden OpenTelemetry zum Sammeln von Anwendungs-Logs. Cast Operations unterstützt derzeit die Log-Aufnahme von diesen OpenTelemetry SDKs:

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

**Integration mit Cast Operations**

Sobald Sie den Telemetrie-Dienst in Ihrer Anwendung konfiguriert haben, können Sie durch Setzen der folgenden Umgebungsvariablen mit Cast Operations integrieren.

| Umgebungsvariable           | Wert                                           |
| --------------------------- | ---------------------------------------------- |
| OTEL_EXPORTER_OTLP_HEADERS  | x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN |
| OTEL_EXPORTER_OTLP_ENDPOINT | https://visca.ai/otlp                     |
| OTEL_SERVICE_NAME           | NAME_OF_YOUR_SERVICE                           |

**Beispiel**

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=9c8806e0-a4aa-11ee-be95-010d5967b068
export OTEL_EXPORTER_OTLP_ENDPOINT=https://visca.ai/otlp
export OTEL_SERVICE_NAME=my-service
```

**Selbst gehostetes Cast Operations**

Wenn Sie Cast Operations selbst hosten, kann dies auf Ihren selbst gehosteten OpenTelemetry Collector-Endpunkt geändert werden (z. B.: `http(s)://YOUR-OPERATIONS-HOST/otlp`)

Sobald Sie Ihre Anwendung ausführen, sollten Sie die Logs auf der Cast Operations-Telemetrie-Dienst-Seite sehen. Wenden Sie sich bitte an support@visca.ai, wenn Sie Hilfe benötigen.

#### OpenTelemetry Collector verwenden

Sie können auch den OpenTelemetry Collector verwenden, anstatt Telemetriedaten direkt aus Ihrer Anwendung zu senden.
Wenn Sie den OpenTelemetry Collector verwenden, können Sie den Cast Operations Exporter in der Collector-Konfigurationsdatei konfigurieren.

Hier ist die Beispielkonfiguration für den OpenTelemetry Collector:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  # Export über HTTP
  otlphttp:
    endpoint: "https://visca.ai/otlp"
    # Erfordert JSON-Encoder statt Standard-Proto(buf)
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "CAST_OPERATIONS_TOKEN" # Ihr Cast Operations-Token

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

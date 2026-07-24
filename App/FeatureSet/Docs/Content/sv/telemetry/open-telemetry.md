# Integrera OpenTelemetry (loggning, mätvärden och spårningar) med Cast Operations.

### Steg 1 – Skapa telemetriintagningstoken.

När du har skapat ett Cast Operations-konto kan du skapa en telemetriintagningstoken för att mata in loggar, mätvärden och spårningar från din applikation.

Efter att du registrerat dig på Cast Operations och skapat ett projekt, klicka på "Mer" i navigeringsfältet och klicka på "Projektinställningar".

På sidan Telemetriintagningsnyckel, klicka på "Skapa intagningsnyckel" för att skapa en token.

![Create Service](/docs/static/images/TelemetryIngestionKeys.png)

När du har skapat en token klickar du på "Visa" för att visa token.

![View Service](/docs/static/images/TelemetryIngestionKeyView.png)

### Steg 2

#### Konfigurera telemetritjänsten i din applikation.

#### Applikationsloggar

Vi använder OpenTelemetry för att samla in applikationsloggar. Cast Operations stöder för närvarande loggintagning från dessa OpenTelemetry SDK:er. Följ instruktionerna för att konfigurera telemetritjänsten i din applikation.

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

**Integrera med Cast Operations**

När du har konfigurerat telemetritjänsten i din applikation kan du integrera med Cast Operations genom att ange följande miljövariabler.

| Miljövariabel               | Värde                                          |
| --------------------------- | ---------------------------------------------- |
| OTEL_EXPORTER_OTLP_HEADERS  | x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN |
| OTEL_EXPORTER_OTLP_ENDPOINT | https://latticeruntime.com/otlp                     |
| OTEL_SERVICE_NAME           | NAME_OF_YOUR_SERVICE                           |

**Exempel**

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=9c8806e0-a4aa-11ee-be95-010d5967b068
export OTEL_EXPORTER_OTLP_ENDPOINT=https://latticeruntime.com/otlp
export OTEL_SERVICE_NAME=my-service
```

**Egeninstallerad Cast Operations**

Om du egeninstallerar Cast Operations kan detta ändras till din egeninstallerade OpenTelemetry-samlarsslutpunkt (t.ex. `http(s)://YOUR-OPERATIONS-HOST/otlp`)

När du kör din applikation bör du se loggarna på Cast Operations-telemetritjänstens sida. Kontakta support@latticeruntime.com om du behöver hjälp.

#### Använda OpenTelemetry Collector

Du kan också använda OpenTelemetry-samlaren istället för att skicka telemetridata direkt från din applikation.
Om du använder OpenTelemetry Collector kan du konfigurera Cast Operations-exportören i samlarens konfigurationsfil.

Här är exempelkonfigurationen för OpenTelemetry Collector.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  # Export over HTTP
  otlphttp:
    endpoint: "https://latticeruntime.com/otlp"
    # Requires use JSON encoder insted of default Proto(buf)
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "CAST_OPERATIONS_TOKEN" # Your Cast Operations token

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

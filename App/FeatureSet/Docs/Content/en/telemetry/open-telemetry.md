# Integrate OpenTelemetry (logging, metrics and traces) with Cast Operations.

### Step 1 - Create Telemetry Ingestion Token.

Once you have created a Cast Operations account, you can create a telemetry ingestion token to ingest logs, metrics and traces from your application.

After you sign up to Cast Operations and create a project. Click on "More" in the Navigation bar and click on "Project Settings".

On the Telemetry Ingestion Key page, click on "Create Ingestion Key" to create a token.

![Create Service](/docs/static/images/TelemetryIngestionKeys.png)

Once you created a token, click on "View" to view the token.

![View Service](/docs/static/images/TelemetryIngestionKeyView.png)

### Step 2

#### Configure the telemetry service in your application.

#### Application Logs

We use OpenTelemetry to collect application logs. Cast Operations currently supports log ingestion from these OpenTelemetry SDKs. Please follow the instructions to configure the telemetry service in your application.

- [C++](https://opentelemetry.io/docs/instrumentation/cpp/)
- [Go](https://opentelemetry.io/docs/instrumentation/go/)
- [Java](https://opentelemetry.io/docs/instrumentation/java/)
- [JavaScript / Typescript / NodeJS / Browser](https://opentelemetry.io/docs/instrumentation/js/)
- [Python](https://opentelemetry.io/docs/instrumentation/python/)
- [Ruby](https://opentelemetry.io/docs/instrumentation/ruby/)
- [PHP](https://opentelemetry.io/docs/instrumentation/php/)
- [Erlang](https://opentelemetry.io/docs/instrumentation/erlang/)
- [Rust](https://opentelemetry.io/docs/instrumentation/rust/)
- [.NET / C#](https://opentelemetry.io/docs/instrumentation/net/)
- [Swift](https://opentelemetry.io/docs/instrumentation/swift/)

**Integrate with Cast Operations**

Once you have configured the telemetry service in your application, you can integrate with Cast Operations by setting the following environment variables.

| Environment Variable        | Value                                          |
| --------------------------- | ---------------------------------------------- |
| OTEL_EXPORTER_OTLP_HEADERS  | x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN |
| OTEL_EXPORTER_OTLP_ENDPOINT | https://visca.ai/otlp                     |
| OTEL_SERVICE_NAME           | NAME_OF_YOUR_SERVICE                           |

**Example**

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=9c8806e0-a4aa-11ee-be95-010d5967b068
export OTEL_EXPORTER_OTLP_ENDPOINT=https://visca.ai/otlp
export OTEL_SERVICE_NAME=my-service
```

**Self Hosted Cast Operations**

If you're self-hosting cast-operations, this can be changed to your self hosted OpenTelemetry collector endpoint (eg: `http(s)://YOUR-OPERATIONS-HOST/otlp`)

Once you run your application, you should see the logs in the Cast Operations telemetry service page. Please contact support@visca.ai if you need any help.

#### Using OpenTelemetry Collector

You can also use the OpenTelemetry collector instead of sending telemetry data directly from your application.
If you are using OpenTelemetry Collector, you can configure the Cast Operations exporter in the collector configuration file.

Here is the example configuration for OpenTelemetry Collector.

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
    endpoint: "https://visca.ai/otlp"
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

### Exceptions from logs

Cast Operations detects exceptions inside your **logs** and rolls them into the same **Exceptions** (Issues) view that trace errors feed. Because each log already resolves to a service or host, log-derived exceptions are attributed to the right resource, and they share the same fingerprint grouping — so an error reported by both a trace and a log collapses into one issue.

There are two detection paths:

1. **Explicit exception attributes (recommended).** A log record that carries the OpenTelemetry `exception.type`, `exception.message`, or `exception.stacktrace` attributes is turned into an exception directly. Most logging integrations (Logback / Log4j appenders, Serilog, the Python logging instrumentation, etc.) set these when you log an exception. This is precise and language-agnostic.

2. **Stack traces in the log body.** For error/fatal logs without those attributes — for example raw stdout, syslog, or journald — Cast Operations scans the body for a stack trace (JavaScript, Python, Java, Go, Ruby, C#/.NET, PHP) and extracts the type, message, and frames. Multi-line traces must arrive as a single log record; if you collect plain-text logs, enable multiline recombination at the collector (see the [Host OpenTelemetry Collector](/docs/telemetry/host-otel-collector) guide).

This is on by default. On self-hosted Cast Operations you can disable it by setting `TELEMETRY_LOG_EXCEPTION_EXTRACTION_ENABLED=false` on the ingest service.

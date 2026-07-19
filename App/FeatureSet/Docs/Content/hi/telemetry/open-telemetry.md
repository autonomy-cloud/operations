# Cast Operations के साथ OpenTelemetry (logging, metrics और traces) Integrate करें।

### चरण 1 - Telemetry Ingestion Token बनाएं।

Cast Operations account बनाने के बाद, आप अपने application से logs, metrics और traces ingest करने के लिए एक telemetry ingestion token बना सकते हैं।

Cast Operations sign up करने और project बनाने के बाद। Navigation bar में "More" पर क्लिक करें और "Project Settings" पर क्लिक करें।

Telemetry Ingestion Key page पर, token बनाने के लिए "Create Ingestion Key" पर क्लिक करें।

![Create Service](/docs/static/images/TelemetryIngestionKeys.png)

Token बनाने के बाद, token देखने के लिए "View" पर क्लिक करें।

![View Service](/docs/static/images/TelemetryIngestionKeyView.png)

### चरण 2

#### अपने application में telemetry service configure करें।

#### Application Logs

हम application logs एकत्र करने के लिए OpenTelemetry उपयोग करते हैं। Cast Operations वर्तमान में इन OpenTelemetry SDKs से log ingestion का समर्थन करता है। कृपया अपने application में telemetry service configure करने के निर्देशों का पालन करें।

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

**Cast Operations के साथ Integrate करें**

एक बार जब आप अपने application में telemetry service configure कर लें, तो आप निम्नलिखित environment variables सेट करके Cast Operations के साथ integrate कर सकते हैं।

| Environment Variable        | Value                                          |
| --------------------------- | ---------------------------------------------- |
| OTEL_EXPORTER_OTLP_HEADERS  | x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN |
| OTEL_EXPORTER_OTLP_ENDPOINT | https://visca.ai/otlp                     |
| OTEL_SERVICE_NAME           | NAME_OF_YOUR_SERVICE                           |

**उदाहरण**

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=9c8806e0-a4aa-11ee-be95-010d5967b068
export OTEL_EXPORTER_OTLP_ENDPOINT=https://visca.ai/otlp
export OTEL_SERVICE_NAME=my-service
```

**Self Hosted Cast Operations**

यदि आप cast-operations self-hosting कर रहे हैं, तो इसे आपके self-hosted OpenTelemetry collector endpoint पर बदला जा सकता है (जैसे: `http(s)://YOUR-OPERATIONS-HOST/otlp`)

एक बार जब आप अपना application चलाते हैं, तो आपको Cast Operations telemetry service page में logs दिखने चाहिए। यदि आपको सहायता की आवश्यकता है तो कृपया support@visca.ai से संपर्क करें।

#### OpenTelemetry Collector का उपयोग करना

आप अपने application से directly telemetry data भेजने के बजाय OpenTelemetry collector भी उपयोग कर सकते हैं।
यदि आप OpenTelemetry Collector उपयोग कर रहे हैं, तो आप collector configuration फ़ाइल में Cast Operations exporter configure कर सकते हैं।

OpenTelemetry Collector के लिए उदाहरण configuration यहाँ है।

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  # HTTP पर Export करें
  otlphttp:
    endpoint: "https://visca.ai/otlp"
    # Default Proto(buf) के बजाय JSON encoder उपयोग आवश्यक
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "CAST_OPERATIONS_TOKEN" # आपका Cast Operations token

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

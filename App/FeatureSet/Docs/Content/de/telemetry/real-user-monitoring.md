# Real User Monitoring (Browser & Mobile)

## Überblick

Cast Operations klassifiziert eingehende Telemetrie als **RUM**, wenn sie Client-Attribute trägt — `browser.*` für Web oder `device.*` für Mobilgeräte. Jede Anwendung wird durch ihren `service.name` identifiziert und gehört vollständig ihrer RUM-Anwendung (Client-Telemetrie wird niemals als Backend-Service dupliziert).

Nutze es, um zu sehen, was deine Nutzer tatsächlich erleben: Seitenaufrufe, Fehler, Latenz, die verwendeten Plattformen / Geräte und — wenn dein SDK sie ausgibt — Core Web Vitals.

## Voraussetzungen

- Ein **Cast Operations Telemetry Ingestion Token** — erstelle einen unter _Project Settings → Telemetry Ingestion Keys_.
- Das OpenTelemetry-Browser- oder -Mobile-SDK.

## Wie Cast Operations eine RUM-Anwendung identifiziert

| Attribut                 | Erforderlich    | Zweck                                               |
| ------------------------ | --------------- | --------------------------------------------------- |
| `service.name`           | **ja**          | Anwendungsidentität (z. B. `storefront-web`)        |
| `browser.*`              | für Web         | Kennzeichnet die Telemetrie als Browser-RUM         |
| `device.*`               | für Mobilgeräte | Kennzeichnet die Telemetrie als Mobile-RUM          |
| `telemetry.sdk.language` | nein            | z. B. `webjs`, `swift`, wird im Überblick angezeigt |

## Browser (OpenTelemetry Web)

Richte den OTLP/HTTP-Exporter auf Cast Operations aus und setze `service.name` auf den Namen deiner App:

```js
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

// Cast Operations OTLP/HTTP exporter:
const exporter = new OTLPTraceExporter({
  url: "https://visca.ai/otlp/v1/traces",
  headers: { "x-oneuptime-token": "YOUR_TELEMETRY_INGESTION_TOKEN" },
});

// Register `exporter` with your WebTracerProvider, using a resource of:
//   { "service.name": "storefront-web" }
```

Die Browser-Instrumentierung fügt automatisch `browser.*`-Ressourcenattribute hinzu — das ist es, was die Daten an RUM leitet.

## Mobile (Swift / Android)

Verwende das OpenTelemetry-Swift- oder -Android-SDK, setze `service.name` und exportiere OTLP zu Cast Operations:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT="https://visca.ai/otlp"
OTEL_EXPORTER_OTLP_HEADERS="x-oneuptime-token=YOUR_TELEMETRY_INGESTION_TOKEN"
```

Die `device.*`-Attribute des SDK leiten die Telemetrie an RUM. Wenn du Cast Operations selbst hostest, verwende `https://YOUR-OPERATIONS-HOST/otlp`.

## Core Web Vitals

Wenn deine Browser-Instrumentierung Web Vitals (LCP, INP, CLS, FCP, TTFB) als OpenTelemetry-Metriken ausgibt, zeigt Cast Operations sie im Anwendungsüberblick mit den Bewertungen gut / verbesserungswürdig / schlecht an. Wenn keine Web-Vital-Metriken gemeldet werden, erklärt das Panel, wie du mit dem Senden beginnst.

## Was du bekommst

- **Seitenaufrufe**, **Fehlerrate** und **p95-Dauer** mit Trenddiagrammen über einen wählbaren Zeitraum.
- **Clients** — die erkannten Browser-Plattformen / Gerätemodelle.
- **Core Web Vitals** (sofern gemeldet).
- Vollständige **Logs**-, **Traces**- und **Metrics**-Tabs, die auf die Anwendung beschränkt sind.

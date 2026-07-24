# Övervakning av verkliga användare (webbläsare och mobil)

## Översikt

Cast Operations klassificerar inkommande telemetri som **RUM** när den bär klientattribut — `browser.*` för webb eller `device.*` för mobil. Varje applikation identifieras med sitt `service.name` och ägs helt av sin RUM-applikation (klienttelemetri dupliceras aldrig som en backend-tjänst).

Använd det för att se vad dina användare faktiskt upplever: sidvisningar, fel, latens, plattformarna/enheterna som används och — när din SDK skickar dem — Core Web Vitals.

## Förutsättningar

- En **Cast Operations Telemetry Ingestion Token** — skapa en från _Project Settings → Telemetry Ingestion Keys_.
- OpenTelemetry-SDK:n för webbläsare eller mobil.

## Hur Cast Operations identifierar en RUM-applikation

| Attribut                 | Krävs     | Syfte                                          |
| ------------------------ | --------- | ---------------------------------------------- |
| `service.name`           | **ja**    | Applikationsidentitet (t.ex. `storefront-web`) |
| `browser.*`              | för webb  | Markerar telemetrin som webbläsar-RUM          |
| `device.*`               | för mobil | Markerar telemetrin som mobil-RUM              |
| `telemetry.sdk.language` | nej       | t.ex. `webjs`, `swift`, visas i översikten     |

## Webbläsare (OpenTelemetry Web)

Rikta OTLP/HTTP-exportören mot Cast Operations och ange `service.name` till din applikations namn:

```js
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

// Cast Operations OTLP/HTTP exporter:
const exporter = new OTLPTraceExporter({
  url: "https://latticeruntime.com/otlp/v1/traces",
  headers: { "x-cast-operations-token": "YOUR_TELEMETRY_INGESTION_TOKEN" },
});

// Register `exporter` with your WebTracerProvider, using a resource of:
//   { "service.name": "storefront-web" }
```

Webbläsarinstrumenteringen lägger automatiskt till `browser.*`-resursattribut — det är det som dirigerar data till RUM.

## Mobil (Swift / Android)

Använd OpenTelemetry-SDK:n för Swift eller Android, ange `service.name` och exportera OTLP till Cast Operations:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT="https://latticeruntime.com/otlp"
OTEL_EXPORTER_OTLP_HEADERS="x-cast-operations-token=YOUR_TELEMETRY_INGESTION_TOKEN"
```

SDK:ns `device.*`-attribut dirigerar telemetrin till RUM. Om du själv driftar Cast Operations, använd `https://YOUR-OPERATIONS-HOST/otlp`.

## Core Web Vitals

Om din webbläsarinstrumentering skickar web vitals (LCP, INP, CLS, FCP, TTFB) som OpenTelemetry-mätvärden, visar Cast Operations dem i applikationsöversikten med betygen bra/behöver förbättras/dålig. Om inga web vitals-mätvärden rapporteras förklarar panelen hur du börjar skicka dem.

## Vad du får

- **Sidvisningar**, **felfrekvens** och **p95-varaktighet** med trenddiagram över ett valbart intervall.
- **Klienter** — webbläsarplattformarna/enhetsmodellerna som setts.
- **Core Web Vitals** (när de rapporteras).
- Fullständiga flikar för **Logs**, **Traces** och **Metrics** avgränsade till applikationen.

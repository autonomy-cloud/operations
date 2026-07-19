# Real User Monitoring (browser og mobil)

## Oversigt

Cast Operations klassificerer indkommende telemetri som **RUM**, når den bærer klientattributter — `browser.*` for web eller `device.*` for mobil. Hver applikation identificeres ved sit `service.name` og ejes udelukkende af sin RUM-applikation (klienttelemetri duplikeres aldrig som en backend-Service).

Brug den til at se, hvad dine brugere faktisk oplever: sidevisninger, fejl, latens, de platforme/enheder, der er i brug, og — når dit SDK udsender dem — Core Web Vitals.

## Forudsætninger

- En **Cast Operations Telemetry Ingestion Token** — opret en fra _Project Settings → Telemetry Ingestion Keys_.
- OpenTelemetry browser- eller mobil-SDK'et.

## Hvordan Cast Operations identificerer en RUM-applikation

| Attribut                 | Påkrævet  | Formål                                          |
| ------------------------ | --------- | ----------------------------------------------- |
| `service.name`           | **ja**    | Applikationsidentitet (f.eks. `storefront-web`) |
| `browser.*`              | for web   | Markerer telemetrien som browser-RUM            |
| `device.*`               | for mobil | Markerer telemetrien som mobil-RUM              |
| `telemetry.sdk.language` | nej       | f.eks. `webjs`, `swift`, vises på oversigten    |

## Browser (OpenTelemetry Web)

Peg OTLP/HTTP-eksportøren mod Cast Operations, og sæt `service.name` til navnet på din app:

```js
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

// Cast Operations OTLP/HTTP exporter:
const exporter = new OTLPTraceExporter({
  url: "https://visca.ai/otlp/v1/traces",
  headers: { "x-cast-operations-token": "YOUR_TELEMETRY_INGESTION_TOKEN" },
});

// Register `exporter` with your WebTracerProvider, using a resource of:
//   { "service.name": "storefront-web" }
```

Browser-instrumenteringen tilføjer automatisk `browser.*`-ressourceattributter — det er det, der dirigerer dataene til RUM.

## Mobil (Swift / Android)

Brug OpenTelemetry Swift- eller Android-SDK'et, sæt `service.name`, og eksportér OTLP til Cast Operations:

```bash
OTEL_EXPORTER_OTLP_ENDPOINT="https://visca.ai/otlp"
OTEL_EXPORTER_OTLP_HEADERS="x-cast-operations-token=YOUR_TELEMETRY_INGESTION_TOKEN"
```

SDK'ets `device.*`-attributter dirigerer telemetrien til RUM. Hvis du selv hoster Cast Operations, så brug `https://YOUR-OPERATIONS-HOST/otlp`.

## Core Web Vitals

Hvis din browser-instrumentering udsender web vitals (LCP, INP, CLS, FCP, TTFB) som OpenTelemetry-metrikker, viser Cast Operations dem på applikationsoversigten med vurderingerne god/kræver-forbedring/dårlig. Hvis der ikke rapporteres web-vital-metrikker, forklarer panelet, hvordan du begynder at sende dem.

## Hvad du får

- **Sidevisninger**, **fejlrate** og **p95-varighed** med trend-diagrammer over et interval, du kan vælge.
- **Klienter** — de browserplatforme/enhedsmodeller, der er set.
- **Core Web Vitals** (når rapporteret).
- Fuldstændige faner for **Logs**, **Traces** og **Metrics** afgrænset til applikationen.

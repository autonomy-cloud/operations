# Continue profileergegevens verzenden naar Cast Operations

## Overzicht

Continue profilering is de vierde pijler van observabiliteit naast logboeken, metrics en traces. Profielen leggen vast hoe uw applicatie CPU-tijd besteedt, geheugen toewijst en systeemresources gebruikt op functieniveau. Cast Operations verwerkt profileergegevens via het OpenTelemetry Protocol (OTLP) en slaat ze op naast uw andere telemetriesignalen voor gecombineerde analyse.

Met profileergegevens in Cast Operations kunt u actieve functies die CPU verbruiken identificeren, geheugenlekken detecteren, knelpunten bij concurrentieproblemen vinden en prestatieproblemen correleren met specifieke traces en spans.

## Ondersteunde profieltypen

Cast Operations ondersteunt de volgende profieltypen:

| Profieltype   | Beschrijving                                | Eenheid      |
| ------------- | ------------------------------------------- | ------------ |
| cpu           | CPU-tijd besteed aan het uitvoeren van code | nanoseconden |
| wall          | Wandkloktijd (inclusief wachten/slapen)     | nanoseconden |
| alloc_objects | Aantal heap-toewijzingen                    | aantal       |
| alloc_space   | Bytes heap-geheugen toegewezen              | bytes        |
| goroutine     | Aantal actieve goroutines (Go)              | aantal       |
| contention    | Tijd besteed aan wachten op locks/mutexes   | nanoseconden |

## Aan de slag

### Stap 1 - Een telemetrie-ingestietoken aanmaken

Nadat u zich hebt aangemeld bij Cast Operations en een project hebt aangemaakt, klikt u op "Meer" in de navigatiebalk en vervolgens op "Projectinstellingen".

Klik op de pagina Telemetrie-ingestiesleutel op "Ingestiesleutel aanmaken" om een token aan te maken.

![Dienst aanmaken](/docs/static/images/TelemetryIngestionKeys.png)

Zodra u een token hebt aangemaakt, klikt u op "Bekijken" om het token te bekijken.

![Dienst bekijken](/docs/static/images/TelemetryIngestionKeyView.png)

### Stap 2 - Uw profiler configureren

Cast Operations accepteert profileergegevens via zowel gRPC als HTTP met het OTLP-profielenprotocol.

| Protocol | Eindpunt                                                    |
| -------- | ----------------------------------------------------------- |
| gRPC     | `your-operations-host:4317` (standaard gRPC-poort voor OTLP) |
| HTTP     | `https://your-operations-host/otlp/v1/profiles`              |

**Omgevingsvariabelen**

Stel de volgende omgevingsvariabelen in om uw profiler naar Cast Operations te laten verwijzen:

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN
export OTEL_EXPORTER_OTLP_ENDPOINT=https://latticeruntime.com/otlp
export OTEL_SERVICE_NAME=my-service
```

**Zelf-gehoste Cast Operations**

Als u Cast Operations zelf host, vervangt u het eindpunt door uw eigen host (bijv. `http(s)://YOUR-OPERATIONS-HOST/otlp`). Maak voor gRPC rechtstreeks verbinding met poort 4317 op uw Cast Operations-host.

## Instrumentatiegids

### Grafana Alloy gebruiken (eBPF-gebaseerde profilering)

Grafana Alloy (voorheen Grafana Agent) kan CPU-profielen verzamelen van alle processen op een Linux-host met behulp van eBPF, zonder codewijzigingen. Configureer het om te exporteren via OTLP naar Cast Operations.

Voorbeeld Alloy-configuratie:

```hcl
pyroscope.ebpf "default" {
  forward_to = [pyroscope.write.cast-operations.receiver]
  targets    = discovery.process.all.targets
}

pyroscope.write "cast-operations" {
  endpoint {
    url = "https://latticeruntime.com/pyroscope"
    headers = {
      "x-cast-operations-token" = "YOUR_CAST_OPERATIONS_SERVICE_TOKEN",
    }
  }
}
```

### async-profiler gebruiken (Java)

Voor Java-applicaties gebruikt u [async-profiler](https://github.com/async-profiler/async-profiler) met de OpenTelemetry Java-agent om profileergegevens via OTLP te sturen.

```bash
# Start uw Java-applicatie met de OpenTelemetry Java-agent
java -javaagent:opentelemetry-javaagent.jar \
  -Dotel.exporter.otlp.endpoint=https://latticeruntime.com/otlp \
  -Dotel.exporter.otlp.headers=x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN \
  -Dotel.service.name=my-java-service \
  -jar my-app.jar
```

### Go pprof met OTLP-export gebruiken

Voor Go-applicaties kunt u het standaard `net/http/pprof`-pakket gebruiken naast een OTLP-exporter. Configureer continue profilering door periodiek pprof-gegevens te verzamelen en door te sturen naar Cast Operations.

```go
import (
    "runtime/pprof"
    "bytes"
    "time"
)

// Verzamel een 30-seconden CPU-profiel en exporteer periodiek
func collectProfile() {
    var buf bytes.Buffer
    pprof.StartCPUProfile(&buf)
    time.Sleep(30 * time.Second)
    pprof.StopCPUProfile()
    // Converteer pprof-uitvoer naar OTLP-formaat en stuur naar Cast Operations
}
```

Als alternatief gebruikt u de OpenTelemetry Collector met een profileringsontvanger die het `/debug/pprof`-eindpunt van uw Go-applicatie scrapet en exporteert via OTLP.

### py-spy gebruiken (Python)

Voor Python-applicaties kan [py-spy](https://github.com/benfred/py-spy) CPU-profielen vastleggen zonder codewijzigingen. Gebruik de OpenTelemetry Collector om profielgegevens te ontvangen en door te sturen.

```bash
# Profielen vastleggen en sturen naar een lokale OTLP-collector
py-spy record --format speedscope --pid $PID -o profile.json
```

Voor continue profilering voert u py-spy naast uw applicatie uit en configureert u de OpenTelemetry Collector om de profielen te verwerken en door te sturen naar Cast Operations.

## De OpenTelemetry Collector gebruiken

U kunt de OpenTelemetry Collector gebruiken als proxy om profielen van uw applicaties te ontvangen en door te sturen naar Cast Operations.

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

exporters:
  otlphttp:
    endpoint: "https://latticeruntime.com/otlp"
    encoding: json
    headers:
      "Content-Type": "application/json"
      "x-cast-operations-token": "YOUR_CAST_OPERATIONS_SERVICE_TOKEN"

service:
  pipelines:
    profiles:
      receivers: [otlp]
      exporters: [otlphttp]
```

## Functies

### Vlambalkvisualisatie

Cast Operations geeft profielgegevens weer als interactieve vlambalken. Elke balk vertegenwoordigt een functie in de aanroepstapel, en de breedte is evenredig aan de verbruikte tijd of resources. U kunt op een willekeurige functie klikken om in te zoomen en de aanroepers en aangeroepenen te bekijken.

### Functielijst

Bekijk een sorteerbare tabel van alle functies die zijn vastgelegd in een profiel, gerangschikt op eigen tijd, totale tijd of aantal toewijzingen. Dit helpt u snel de duurste functies in uw applicatie te identificeren.

### Trace-correlatie

Profielen in Cast Operations kunnen worden gecorreleerd met gedistribueerde traces. Wanneer een profiel trace- en span-ID's bevat (via de OTLP-linktabel), kunt u rechtstreeks navigeren van een langzame trace-span naar het bijbehorende CPU- of geheugenprofiel om precies te begrijpen welke code werd uitgevoerd.

### Filteren op profieltype

Filter profielen op type (cpu, wall, alloc_objects, alloc_space, goroutine, contention) om u te concentreren op de specifieke resourcedimensie die u onderzoekt.

## Gegevensbewaring

De bewaring van profielgegevens wordt geconfigureerd per telemetriedienst in uw Cast Operations-projectinstellingen. De standaard bewaartermijn is 15 dagen. Gegevens worden automatisch verwijderd nadat de bewaartermijn is verstreken.

Om de bewaartermijn voor een dienst te wijzigen, navigeert u naar **Telemetrie > Diensten > [Uw dienst] > Instellingen** en werkt u de waarde voor gegevensbewaring bij.

## Hulp nodig?

Neem contact op via support@latticeruntime.com als u hulp nodig heeft bij het instellen van profilering met Cast Operations.

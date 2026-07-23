# Skicka kontinuerliga profileringsdata till Cast Operations

## Översikt

Kontinuerlig profilering är den fjärde pelaren i observabilitet tillsammans med loggar, mätvärden och spårningar. Profiler fångar hur din applikation spenderar CPU-tid, allokerar minne och använder systemresurser på funktionsnivå. Cast Operations tar emot profileringsdata via OpenTelemetry Protocol (OTLP) och lagrar den tillsammans med dina andra telemetrisignaler för enhetlig analys.

Med profileringsdata i Cast Operations kan du identifiera funktioner som konsumerar CPU, identifiera minnesläckor, hitta konkurrensbegränsningar och korrelera prestandaproblem med specifika spårningar och spans.

## Profiltyper som stöds

Cast Operations stöder följande profiltyper:

| Profiltyp     | Beskrivning                             | Enhet        |
| ------------- | --------------------------------------- | ------------ |
| cpu           | CPU-tid spenderad på att exekvera kod   | nanosekunder |
| wall          | Väggklocktid (inkluderar väntan/sömn)   | nanosekunder |
| alloc_objects | Antal heap-allokeringar                 | antal        |
| alloc_space   | Bytes av heap-minne allokerat           | bytes        |
| goroutine     | Antal aktiva goroutines (Go)            | antal        |
| contention    | Tid spenderad på att vänta på lås/mutex | nanosekunder |

## Kom igång

### Steg 1 – Skapa en telemetriintagningstoken

Efter att du registrerat dig på Cast Operations och skapat ett projekt, klicka på "Mer" i navigeringsfältet och klicka på "Projektinställningar".

På sidan Telemetriintagningsnyckel, klicka på "Skapa intagningsnyckel" för att skapa en token.

![Create Service](/docs/static/images/TelemetryIngestionKeys.png)

När du har skapat en token klickar du på "Visa" för att visa token.

![View Service](/docs/static/images/TelemetryIngestionKeyView.png)

### Steg 2 – Konfigurera din profilerare

Cast Operations accepterar profileringsdata via både gRPC och HTTP med OTLP-profilprotokollet.

| Protokoll | Slutpunkt                                            |
| --------- | ---------------------------------------------------- |
| gRPC      | `your-operations-host:4317` (OTLP standard gRPC-port) |
| HTTP      | `https://your-operations-host/otlp/v1/profiles`       |

**Miljövariabler**

Ange följande miljövariabler för att peka din profilerare på Cast Operations:

```bash
export OTEL_EXPORTER_OTLP_HEADERS=x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN
export OTEL_EXPORTER_OTLP_ENDPOINT=https://latticeruntime.com/otlp
export OTEL_SERVICE_NAME=my-service
```

**Egeninstallerad Cast Operations**

Om du egeninstallerar Cast Operations, ersätt slutpunkten med din egen värd (t.ex. `http(s)://YOUR-OPERATIONS-HOST/otlp`). För gRPC, anslut direkt till port 4317 på din Cast Operations-värd.

## Instrumenteringsguide

### Använda Grafana Alloy (eBPF-baserad profilering)

Grafana Alloy (tidigare Grafana Agent) kan samla in CPU-profiler från alla processer på en Linux-värd med eBPF, utan några kodändringar. Konfigurera den för att exportera via OTLP till Cast Operations.

Exempel på Alloy-konfiguration:

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

### Använda async-profiler (Java)

För Java-applikationer, använd [async-profiler](https://github.com/async-profiler/async-profiler) med OpenTelemetry Java-agenten för att skicka profileringsdata via OTLP.

```bash
# Start your Java application with the OpenTelemetry Java agent
java -javaagent:opentelemetry-javaagent.jar \
  -Dotel.exporter.otlp.endpoint=https://latticeruntime.com/otlp \
  -Dotel.exporter.otlp.headers=x-cast-operations-token=YOUR_CAST_OPERATIONS_SERVICE_TOKEN \
  -Dotel.service.name=my-java-service \
  -jar my-app.jar
```

## Använda OpenTelemetry Collector

Du kan använda OpenTelemetry Collector som proxy för att ta emot profiler från dina applikationer och vidarebefordra dem till Cast Operations.

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

## Funktioner

### Flamegraf-visualisering

Cast Operations renderar profildata som interaktiva flamegrafar. Varje stapel representerar en funktion i anropsstacken och dess bredd är proportionell mot den tid eller de resurser som konsumeras. Du kan klicka på valfri funktion för att zooma in och se dess anropare och anropstagare.

### Funktionslista

Visa en sorterbar tabell med alla funktioner som fångats i en profil, rankade efter självtid, total tid eller allokeringsantal. Detta hjälper dig att snabbt identifiera de dyraste funktionerna i din applikation.

### Spårningskorrelation

Profiler i Cast Operations kan korreleras med distribuerade spårningar. När en profil inkluderar spårnings- och span-ID:n (via OTLP-länktabellen) kan du navigera direkt från ett långsamt spårningsspan till motsvarande CPU- eller minnesprofil för att förstå exakt vilken kod som kördes.

## Datalagring

Profildatalagring konfigureras per telemetritjänst i dina Cast Operations-projektinställningar. Standardlagringsperioden är 15 dagar. Data tas automatiskt bort efter att lagringsperioden löper ut.

För att ändra lagringsperioden för en tjänst, navigera till **Telemetri > Tjänster > [Din tjänst] > Inställningar** och uppdatera datalagringsvärdet.

## Behöver du hjälp?

Kontakta support@latticeruntime.com om du behöver hjälp med att konfigurera profilering med Cast Operations.

# Cast Operations Docker-agent

## Översikt

Cast Operations Docker-agenten är en förbyggd containeravbildning som levereras med en finjusterad OpenTelemetry Collector-konfiguration. Kör den bredvid dina befintliga containrar så upptäcker den automatiskt varje container på värden, samlar in mätvärden för CPU / minne / nätverk / block-I/O plus containerloggar och vidarebefordrar allt till Cast Operations via OTLP. En enda avbildning, ett enda kommando.

Den här sidan är **installationsguiden**. För att konfigurera Docker-monitorer och varningar ovanpå de data som agenten samlar in, se [Docker Monitor](/docs/monitor/docker-monitor).

## Förutsättningar

- Docker Engine 20.10+
- Åtkomst till `/var/run/docker.sock` på värden
- En **Cast Operations Telemetry Ingestion Token** — skapa en från _Project Settings → Telemetry Ingestion Keys_ och kopiera värdet

## Snabbstart (ett kommando)

Ersätt `YOUR_CAST_OPERATIONS_URL`, `YOUR_TELEMETRY_INGESTION_TOKEN` och värdnamnet med värden för din miljö. Värdnamnet är hur den här Docker-värden kommer att visas i Cast Operations — välj något i stil med `prod-docker-01`.

```bash
docker run -d \
  --name cast-operations-docker-agent \
  --user 0:0 \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock:ro \
  -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
  -e CAST_OPERATIONS_URL="YOUR_CAST_OPERATIONS_URL" \
  -e CAST_OPERATIONS_SERVICE_TOKEN="YOUR_TELEMETRY_INGESTION_TOKEN" \
  -e DOCKER_HOST_NAME="my-docker-host" \
  cast-operations/docker-agent:release
```

Det är allt. När agenten ansluter kommer din Docker-värd att visas automatiskt i **Docker**-sektionen i Cast Operations-instrumentpanelen.

## Alternativ — Docker Compose

Om du föredrar Docker Compose, lägg in följande i en `docker-compose.yml`:

```yaml
services:
  cast-operations-docker-agent:
    image: cast-operations/docker-agent:release
    container_name: cast-operations-docker-agent
    user: "0:0"
    restart: unless-stopped
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    environment:
      - CAST_OPERATIONS_URL=YOUR_CAST_OPERATIONS_URL
      - CAST_OPERATIONS_SERVICE_TOKEN=YOUR_TELEMETRY_INGESTION_TOKEN
      - DOCKER_HOST_NAME=my-docker-host
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

Starta den:

```bash
docker compose up -d
```

## Miljövariabler

| Variabel                  | Obligatorisk | Beskrivning                                                                                                                             |
| ------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| `CAST_OPERATIONS_URL`           | Ja           | URL till din Cast Operations-instans (till exempel `https://visca.ai` eller din självhostade värd)                                       |
| `CAST_OPERATIONS_SERVICE_TOKEN` | Ja           | Telemetry ingestion-token från _Project Settings → Telemetry Ingestion Keys_                                                            |
| `DOCKER_HOST_NAME`        | Nej          | Användarvänligt namn för den här värden. Standardvärdet är `docker-host`. Ange det till något stabilt per värd (t.ex. `prod-docker-01`) |

## Verifiera installationen

Kontrollera att agenten körs:

```bash
docker ps --filter name=cast-operations-docker-agent
```

Kontrollera agentens loggar:

```bash
docker logs -f cast-operations-docker-agent
```

Leta efter: `"Everything is ready. Begin running and processing data."`

Inom ungefär en minut bör värden visas i Cast Operations-instrumentpanelen med mätvärden och loggar som flödar in.

## Uppgradera agenten

```bash
docker pull cast-operations/docker-agent:release
docker rm -f cast-operations-docker-agent
# Kör om `docker run`-kommandot ovan
```

Eller med Docker Compose:

```bash
docker compose pull
docker compose up -d
```

## Avinstallera agenten

```bash
docker rm -f cast-operations-docker-agent
```

Om du använde Docker Compose:

```bash
docker compose down
```

## Vad som samlas in

| Kategori                 | Data                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| **CPU-mätvärden**        | Total användning, användningsprocent, throttling-tid (per container) |
| **Minnesmätvärden**      | Användning, gräns, procent, RSS, cache (per container)               |
| **Nätverksmätvärden**    | Mottagna / sända byte och paket (per container)                      |
| **Block-I/O-mätvärden**  | Lästa / skrivna byte och operationer (per container)                 |
| **Containerinformation** | Drifttid, antal omstarter, antal processer                           |
| **Containerloggar**      | stdout / stderr-loggar från alla containrar                          |

## Självhostad Cast Operations

Om du självhostar Cast Operations, ange `CAST_OPERATIONS_URL` till din egen instans:

```bash
-e CAST_OPERATIONS_URL="https://your-operations-host.example.com"
```

Om din instans endast är HTTP, använd `http://` och lämplig port.

## Felsökning

### Åtkomst nekad till Docker-socket

Agentcontainern måste köras som root (`--user 0:0`) för att komma åt `/var/run/docker.sock`. Säkerställ att flaggan `--user 0:0` (eller `user: "0:0"` i Compose) finns med.

### Agenten visas som frånkopplad

1. Kontrollera att agenten körs: `docker ps --filter name=cast-operations-docker-agent`
2. Kontrollera agentens loggar: `docker logs cast-operations-docker-agent | grep -i error`
3. Verifiera att din Cast Operations-URL och service-token är korrekta
4. Säkerställ att din Docker-värd kan nå Cast Operations-instansen över nätverket

### Inga mätvärden visas

1. Verifiera att Docker-socketen är åtkomlig inuti agenten: `docker exec cast-operations-docker-agent ls -la /var/run/docker.sock`
2. Kontrollera collector-loggarna efter exportfel: `docker logs cast-operations-docker-agent | tail -100`
3. Säkerställ att din service-token är giltig och inte har upphört att gälla

### Värdnamnet visas som ett container-ID

Ange miljövariabeln `DOCKER_HOST_NAME` till ett användarvänligt namn och återskapa containern.

## Nästa steg

- Konfigurera **Docker-monitorer** för att varna om villkor för container-CPU / minne / omstart — se [Docker Monitor](/docs/monitor/docker-monitor).
- För Kubernetes-kluster i stället för fristående Docker-värdar, använd [Cast Operations Kubernetes Agent](/docs/telemetry/kubernetes-agent).
- För icke-containeriserade värdar (Linux / macOS / Windows-VM och bare metal), använd [Host OpenTelemetry Collector](/docs/telemetry/host-otel-collector).

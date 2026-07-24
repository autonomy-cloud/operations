# Cast Operations Docker Agent

## Overzicht

De Cast Operations Docker Agent is een kant-en-klare container-image die wordt geleverd met een afgestemde OpenTelemetry Collector-configuratie. Draai hem naast je bestaande containers en hij ontdekt automatisch elke container op de host, verzamelt CPU- / geheugen- / netwerk- / block-I/O-metrics plus containerlogs, en stuurt alles via OTLP door naar Cast Operations. Eén image, één commando.

Deze pagina is de **installatiehandleiding**. Voor het configureren van Docker-monitors en -waarschuwingen bovenop de gegevens die de agent verzamelt, zie [Docker Monitor](/docs/monitor/docker-monitor).

## Vereisten

- Docker Engine 20.10+
- Toegang tot `/var/run/docker.sock` op de host
- Een **Cast Operations Telemetry Ingestion Token** — maak er een aan via _Project Settings → Telemetry Ingestion Keys_ en kopieer de waarde

## Snelstart (Eén commando)

Vervang `YOUR_CAST_OPERATIONS_URL`, `YOUR_TELEMETRY_INGESTION_TOKEN` en de hostnaam door waarden voor jouw omgeving. De hostnaam is hoe deze Docker-host in Cast Operations zal verschijnen — kies iets als `prod-docker-01`.

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

Dat is alles. Zodra de agent verbinding maakt, zal je Docker-host automatisch verschijnen in de **Docker**-sectie van het Cast Operations-dashboard.

## Alternatief — Docker Compose

Als je de voorkeur geeft aan Docker Compose, plaats dan het volgende in een `docker-compose.yml`:

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

Start hem:

```bash
docker compose up -d
```

## Omgevingsvariabelen

| Variabele                 | Vereist | Beschrijving                                                                                                              |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------- |
| `CAST_OPERATIONS_URL`           | Ja      | De URL van je Cast Operations-instantie (bijvoorbeeld `https://latticeruntime.com` of je zelf-gehoste host)                          |
| `CAST_OPERATIONS_SERVICE_TOKEN` | Ja      | Telemetry ingestion token uit _Project Settings → Telemetry Ingestion Keys_                                               |
| `DOCKER_HOST_NAME`        | Nee     | Vriendelijke naam voor deze host. Standaard `docker-host`. Stel hem in op iets stabiels per host (bijv. `prod-docker-01`) |

## De installatie verifiëren

Controleer of de agent draait:

```bash
docker ps --filter name=cast-operations-docker-agent
```

Bekijk de agent-logs:

```bash
docker logs -f cast-operations-docker-agent
```

Zoek naar: `"Everything is ready. Begin running and processing data."`

Binnen ongeveer een minuut zou de host in het Cast Operations-dashboard moeten verschijnen, met metrics en logs die binnenstromen.

## De agent upgraden

```bash
docker pull cast-operations/docker-agent:release
docker rm -f cast-operations-docker-agent
# Voer het `docker run`-commando hierboven opnieuw uit
```

Of met Docker Compose:

```bash
docker compose pull
docker compose up -d
```

## De agent verwijderen

```bash
docker rm -f cast-operations-docker-agent
```

Als je Docker Compose hebt gebruikt:

```bash
docker compose down
```

## Wat wordt er verzameld

| Categorie               | Gegevens                                                            |
| ----------------------- | ------------------------------------------------------------------- |
| **CPU-metrics**         | Totaal gebruik, gebruikspercentage, throttling-tijd (per container) |
| **Geheugen-metrics**    | Gebruik, limiet, percentage, RSS, cache (per container)             |
| **Netwerk-metrics**     | Ontvangen / verzonden bytes en packets (per container)              |
| **Block-I/O-metrics**   | Gelezen / geschreven bytes en bewerkingen (per container)           |
| **Containerinformatie** | Uptime, aantal herstarts, aantal processen                          |
| **Containerlogs**       | stdout- / stderr-logs van alle containers                           |

## Zelf-gehoste Cast Operations

Als je Cast Operations zelf host, stel `CAST_OPERATIONS_URL` dan in op je eigen instantie:

```bash
-e CAST_OPERATIONS_URL="https://your-operations-host.example.com"
```

Als je instantie alleen HTTP gebruikt, gebruik dan `http://` en de juiste poort.

## Probleemoplossing

### Toegang tot Docker-socket geweigerd

De agent-container moet als root draaien (`--user 0:0`) om toegang te krijgen tot `/var/run/docker.sock`. Zorg ervoor dat de vlag `--user 0:0` (of `user: "0:0"` in Compose) aanwezig is.

### Agent wordt weergegeven als losgekoppeld

1. Controleer of de agent draait: `docker ps --filter name=cast-operations-docker-agent`
2. Bekijk de agent-logs: `docker logs cast-operations-docker-agent | grep -i error`
3. Verifieer dat je Cast Operations-URL en service token correct zijn
4. Zorg ervoor dat je Docker-host de Cast Operations-instantie via het netwerk kan bereiken

### Er verschijnen geen metrics

1. Verifieer dat de Docker-socket toegankelijk is binnen de agent: `docker exec cast-operations-docker-agent ls -la /var/run/docker.sock`
2. Bekijk de collector-logs op exportfouten: `docker logs cast-operations-docker-agent | tail -100`
3. Zorg ervoor dat je service token geldig is en niet verlopen

### Hostnaam wordt weergegeven als een container-ID

Stel de omgevingsvariabele `DOCKER_HOST_NAME` in op een vriendelijke naam en maak de container opnieuw aan.

## Volgende stappen

- Configureer **Docker Monitors** om te waarschuwen bij container-CPU- / geheugen- / herstart-condities — zie [Docker Monitor](/docs/monitor/docker-monitor).
- Voor Kubernetes-clusters in plaats van zelfstandige Docker-hosts, gebruik de [Cast Operations Kubernetes Agent](/docs/telemetry/kubernetes-agent).
- Voor niet-gecontaineriseerde hosts (Linux- / macOS- / Windows-VM's en bare metal), gebruik de [Host OpenTelemetry Collector](/docs/telemetry/host-otel-collector).

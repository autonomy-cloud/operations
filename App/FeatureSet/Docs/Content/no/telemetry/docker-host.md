# Cast Operations Docker Agent

## Oversikt

Cast Operations Docker Agent er et ferdigbygd containerbilde som leveres med en finjustert OpenTelemetry Collector-konfigurasjon. Kjor den ved siden av dine eksisterende containere, så oppdager den automatisk hver container på verten, samler inn CPU-/minne-/nettverks-/blokk-I/O-metrikker pluss containerlogger, og videresender alt til Cast Operations over OTLP. Ett bilde, én kommando.

Denne siden er **installasjonsveiledningen**. For å konfigurere Docker-monitorer og varsler på toppen av dataene agenten samler inn, se [Docker Monitor](/docs/monitor/docker-monitor).

## Forutsetninger

- Docker Engine 20.10+
- Tilgang til `/var/run/docker.sock` på verten
- Et **Cast Operations Telemetry Ingestion Token** — opprett ett fra _Project Settings → Telemetry Ingestion Keys_ og kopier verdien

## Hurtigstart (én kommando)

Erstatt `YOUR_CAST_OPERATIONS_URL`, `YOUR_TELEMETRY_INGESTION_TOKEN` og vertsnavnet med verdier for ditt miljo. Vertsnavnet er hvordan denne Docker-verten vil vises i Cast Operations — velg noe som `prod-docker-01`.

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

Det er alt. Når agenten kobler til, vil Docker-verten din vises automatisk i **Docker**-seksjonen i Cast Operations-dashbordet.

## Alternativ — Docker Compose

Hvis du foretrekker Docker Compose, legg folgende inn i en `docker-compose.yml`:

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

Start den:

```bash
docker compose up -d
```

## Miljovariabler

| Variabel                  | Pakrevd | Beskrivelse                                                                                                                |
| ------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `CAST_OPERATIONS_URL`           | Ja      | URL-en til din Cast Operations-instans (for eksempel `https://latticeruntime.com` eller din selvhostede vert)                         |
| `CAST_OPERATIONS_SERVICE_TOKEN` | Ja      | Telemetry ingestion token fra _Project Settings → Telemetry Ingestion Keys_                                                |
| `DOCKER_HOST_NAME`        | Nei     | Vennlig navn for denne verten. Standardverdi er `docker-host`. Sett den til noe stabilt per vert (f.eks. `prod-docker-01`) |

## Verifiser installasjonen

Sjekk at agenten kjorer:

```bash
docker ps --filter name=cast-operations-docker-agent
```

Sjekk agentloggene:

```bash
docker logs -f cast-operations-docker-agent
```

Se etter: `"Everything is ready. Begin running and processing data."`

I lopet av et minutt eller så skal verten vises i Cast Operations-dashbordet med metrikker og logger som strommer inn.

## Oppgradere agenten

```bash
docker pull cast-operations/docker-agent:release
docker rm -f cast-operations-docker-agent
# Kjor `docker run`-kommandoen ovenfor på nytt
```

Eller med Docker Compose:

```bash
docker compose pull
docker compose up -d
```

## Avinstallere agenten

```bash
docker rm -f cast-operations-docker-agent
```

Hvis du brukte Docker Compose:

```bash
docker compose down
```

## Hva som samles inn

| Kategori                | Data                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| **CPU-metrikker**       | Total bruk, bruksprosent, struping (throttling)-tid (per container) |
| **Minnemetrikker**      | Bruk, grense, prosent, RSS, cache (per container)                   |
| **Nettverksmetrikker**  | Byte og pakker mottatt / sendt (per container)                      |
| **Blokk-I/O-metrikker** | Lese-/skrive-byte og -operasjoner (per container)                   |
| **Containerinfo**       | Oppetid, antall omstarter, antall prosesser                         |
| **Containerlogger**     | stdout-/stderr-logger fra alle containere                           |

## Selvhostet Cast Operations

Hvis du selvhoster Cast Operations, sett `CAST_OPERATIONS_URL` til din egen instans:

```bash
-e CAST_OPERATIONS_URL="https://your-operations-host.example.com"
```

Hvis instansen din kun er HTTP, bruk `http://` og riktig port.

## Feilsoking

### Docker Socket Permission Denied

Agentcontaineren må kjore som root (`--user 0:0`) for å få tilgang til `/var/run/docker.sock`. Sorg for at `--user 0:0`-flagget (eller `user: "0:0"` i Compose) er til stede.

### Agenten vises som frakoblet

1. Sjekk at agenten kjorer: `docker ps --filter name=cast-operations-docker-agent`
2. Sjekk agentloggene: `docker logs cast-operations-docker-agent | grep -i error`
3. Verifiser at Cast Operations-URL-en og service-token er riktige
4. Sorg for at Docker-verten din kan nå Cast Operations-instansen over nettverket

### Ingen metrikker vises

1. Verifiser at Docker-socketen er tilgjengelig inne i agenten: `docker exec cast-operations-docker-agent ls -la /var/run/docker.sock`
2. Sjekk collector-loggene for eksportfeil: `docker logs cast-operations-docker-agent | tail -100`
3. Sorg for at service-token er gyldig og ikke utlopt

### Vertsnavnet vises som en container-ID

Sett miljovariabelen `DOCKER_HOST_NAME` til et vennlig navn og gjenopprett containeren.

## Neste steg

- Konfigurer **Docker-monitorer** for å varsle om CPU-/minne-/omstartstilstander for containere — se [Docker Monitor](/docs/monitor/docker-monitor).
- For Kubernetes-klynger i stedet for frittstående Docker-verter, bruk [Cast Operations Kubernetes Agent](/docs/telemetry/kubernetes-agent).
- For ikke-containeriserte verter (Linux-/macOS-/Windows-VM-er og fysiske maskiner), bruk [Host OpenTelemetry Collector](/docs/telemetry/host-otel-collector).

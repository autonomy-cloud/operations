# Cast Operations Docker Agent

## Panoramica

Cast Operations Docker Agent è un'immagine container pre-compilata che include una configurazione ottimizzata di OpenTelemetry Collector. Eseguilo accanto ai tuoi container esistenti e rileverà automaticamente ogni container presente sull'host, raccoglierà metriche di CPU / memoria / rete / I/O a blocchi oltre ai log dei container e inoltrerà tutto a Cast Operations tramite OTLP. Una sola immagine, un solo comando.

Questa pagina è la **guida all'installazione**. Per configurare i monitor e gli avvisi Docker basati sui dati raccolti dall'agent, consulta [Docker Monitor](/docs/monitor/docker-monitor).

## Prerequisiti

- Docker Engine 20.10+
- Accesso a `/var/run/docker.sock` sull'host
- Un **token di acquisizione della telemetria di Cast Operations** — creane uno da _Project Settings → Telemetry Ingestion Keys_ e copia il valore

## Avvio rapido (un solo comando)

Sostituisci `YOUR_CAST_OPERATIONS_URL`, `YOUR_TELEMETRY_INGESTION_TOKEN` e il nome dell'host con i valori del tuo ambiente. Il nome dell'host è il modo in cui questo host Docker apparirà in Cast Operations — scegli qualcosa come `prod-docker-01`.

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

Tutto qui. Una volta che l'agent si connette, il tuo host Docker apparirà automaticamente nella sezione **Docker** della dashboard di Cast Operations.

## Alternativa — Docker Compose

Se preferisci Docker Compose, inserisci quanto segue in un file `docker-compose.yml`:

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

Avvialo:

```bash
docker compose up -d
```

## Variabili d'ambiente

| Variabile                 | Obbligatoria | Descrizione                                                                                                                                        |
| ------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CAST_OPERATIONS_URL`           | Sì           | L'URL della tua istanza Cast Operations (ad esempio `https://latticeruntime.com` o il tuo host self-hosted)                                                   |
| `CAST_OPERATIONS_SERVICE_TOKEN` | Sì           | Token di acquisizione della telemetria da _Project Settings → Telemetry Ingestion Keys_                                                            |
| `DOCKER_HOST_NAME`        | No           | Nome descrittivo per questo host. Il valore predefinito è `docker-host`. Impostalo su un valore stabile per ciascun host (ad es. `prod-docker-01`) |

## Verifica dell'installazione

Verifica che l'agent sia in esecuzione:

```bash
docker ps --filter name=cast-operations-docker-agent
```

Controlla i log dell'agent:

```bash
docker logs -f cast-operations-docker-agent
```

Cerca: `"Everything is ready. Begin running and processing data."`

Entro un minuto circa l'host dovrebbe apparire nella dashboard di Cast Operations con metriche e log in arrivo.

## Aggiornamento dell'agent

```bash
docker pull cast-operations/docker-agent:release
docker rm -f cast-operations-docker-agent
# Riesegui il comando `docker run` riportato sopra
```

Oppure con Docker Compose:

```bash
docker compose pull
docker compose up -d
```

## Disinstallazione dell'agent

```bash
docker rm -f cast-operations-docker-agent
```

Se hai utilizzato Docker Compose:

```bash
docker compose down
```

## Cosa viene raccolto

| Categoria                      | Dati                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------- |
| **Metriche CPU**               | Utilizzo totale, percentuale di utilizzo, tempo di throttling (per container) |
| **Metriche di memoria**        | Utilizzo, limite, percentuale, RSS, cache (per container)                     |
| **Metriche di rete**           | Byte e pacchetti ricevuti / trasmessi (per container)                         |
| **Metriche di I/O a blocchi**  | Byte e operazioni di lettura / scrittura (per container)                      |
| **Informazioni sul container** | Uptime, conteggio dei riavvii, numero di processi                             |
| **Log dei container**          | Log stdout / stderr di tutti i container                                      |

## Cast Operations self-hosted

Se stai eseguendo Cast Operations in self-hosting, imposta `CAST_OPERATIONS_URL` sulla tua istanza:

```bash
-e CAST_OPERATIONS_URL="https://your-operations-host.example.com"
```

Se la tua istanza è solo HTTP, usa `http://` e la porta appropriata.

## Risoluzione dei problemi

### Autorizzazione al socket Docker negata

Il container dell'agent deve essere eseguito come root (`--user 0:0`) per accedere a `/var/run/docker.sock`. Assicurati che sia presente il flag `--user 0:0` (oppure `user: "0:0"` in Compose).

### L'agent risulta disconnesso

1. Verifica che l'agent sia in esecuzione: `docker ps --filter name=cast-operations-docker-agent`
2. Controlla i log dell'agent: `docker logs cast-operations-docker-agent | grep -i error`
3. Verifica che l'URL di Cast Operations e il token del servizio siano corretti
4. Assicurati che il tuo host Docker possa raggiungere l'istanza di Cast Operations tramite la rete

### Nessuna metrica visualizzata

1. Verifica che il socket Docker sia accessibile all'interno dell'agent: `docker exec cast-operations-docker-agent ls -la /var/run/docker.sock`
2. Controlla i log del collector per individuare errori di esportazione: `docker logs cast-operations-docker-agent | tail -100`
3. Assicurati che il tuo token del servizio sia valido e non scaduto

### Il nome dell'host appare come un ID di container

Imposta la variabile d'ambiente `DOCKER_HOST_NAME` su un nome descrittivo e ricrea il container.

## Passaggi successivi

- Configura i **Docker Monitor** per ricevere avvisi sulle condizioni di CPU / memoria / riavvio dei container — consulta [Docker Monitor](/docs/monitor/docker-monitor).
- Per i cluster Kubernetes anziché host Docker autonomi, usa [Cast Operations Kubernetes Agent](/docs/telemetry/kubernetes-agent).
- Per host non containerizzati (VM e bare metal Linux / macOS / Windows), usa [Host OpenTelemetry Collector](/docs/telemetry/host-otel-collector).

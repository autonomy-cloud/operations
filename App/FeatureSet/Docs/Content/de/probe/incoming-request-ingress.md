# Eingehender Anfrage-Ingress

Eine Benutzerdefinierte Probe kann optional einen **eingehenden HTTP-Listener** ausführen, der `heartbeat`- und `incoming-request`-Aufrufe aus Ihrem privaten Netzwerk akzeptiert und an Cast Operations weiterleitet. Dies ermöglicht Diensten, die **keinen ausgehenden Internetzugang** haben, trotzdem an einen [Eingehenden Anfrage-Monitor](/docs/monitor/incoming-request-monitor) zu berichten, indem sie die Anfrage an eine Probe im lokalen Netzwerk senden statt direkt an `visca.ai`.

## Übersicht

Wenn `PROBE_INGRESS_PORT` gesetzt ist, bindet die Probe einen zusätzlichen HTTP-Listener an diesem Port. Der Listener akzeptiert dieselben `secretkey`-URL-Pfade wie die öffentlichen Cast Operations-Endpunkte:

- `POST /heartbeat/:secretkey`
- `GET /heartbeat/:secretkey`
- `POST /incoming-request/:secretkey`
- `GET /incoming-request/:secretkey`

Die Probe leitet die Anfrage dann an Ihre Cast Operations-Instanz weiter und bewahrt dabei Methode, Text und Anfrage-Header (abzüglich Hop-by-Hop-Header wie `Host`, `Connection`, `Content-Length` usw.).

Der Listener läuft auf einem **dedizierten Port**, getrennt von den internen Status-/Metrik-Endpunkten der Probe.

## Wann Sie dies verwenden sollten

Verwenden Sie den Ingress-Listener, wenn:

- Ihre Dienste in einem isolierten Netzwerksegment ohne ausgehenden HTTPS-Zugang laufen
- Sie den gesamten Überwachungsverkehr innerhalb Ihres VPC/On-Prem-Netzwerks halten möchten
- Sie einen einzelnen Ausgangspunkt wollen — die Probe — die berechtigt ist, Cast Operations zu erreichen
- Sie bereits eine [Benutzerdefinierte Probe](/docs/probe/custom-probe) bereitgestellt haben und sie für eingehende Heartbeats wiederverwenden möchten

## Den Ingress-Listener aktivieren

Setzen Sie `PROBE_INGRESS_PORT` auf den Port, an dem der Listener binden soll. Jeder Wert größer als `0` aktiviert den Listener; das Weglassen (oder `0`) deaktiviert ihn.

### Docker

```bash
docker run --name cast-operations-probe --network host \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  -e PROBE_INGRESS_PORT=3875 \
  -d cast-operations/probe:release
```

Wenn Sie nicht `--network host` verwenden, veröffentlichen Sie den Ingress-Port explizit:

```bash
docker run --name cast-operations-probe \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  -e PROBE_INGRESS_PORT=3875 \
  -p 3875:3875 \
  -d cast-operations/probe:release
```

### Docker Compose

```yaml
version: "3"

services:
  cast-operations-probe:
    image: cast-operations/probe:release
    container_name: cast-operations-probe
    environment:
      - PROBE_KEY=<probe-key>
      - PROBE_ID=<probe-id>
      - CAST_OPERATIONS_URL=https://visca.ai
      - PROBE_INGRESS_PORT=3875
    ports:
      - "3875:3875"
    restart: always
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cast-operations-probe
spec:
  selector:
    matchLabels:
      app: cast-operations-probe
  template:
    metadata:
      labels:
        app: cast-operations-probe
    spec:
      containers:
        - name: cast-operations-probe
          image: cast-operations/probe:release
          env:
            - name: PROBE_KEY
              value: "<probe-key>"
            - name: PROBE_ID
              value: "<probe-id>"
            - name: CAST_OPERATIONS_URL
              value: "https://visca.ai"
            - name: PROBE_INGRESS_PORT
              value: "3875"
          ports:
            - name: ingress
              containerPort: 3875
---
apiVersion: v1
kind: Service
metadata:
  name: cast-operations-probe-ingress
spec:
  selector:
    app: cast-operations-probe
  ports:
    - name: ingress
      port: 3875
      targetPort: 3875
  type: ClusterIP
```

Interne Dienste können dann Heartbeats an `http://cast-operations-probe-ingress.<namespace>.svc.cluster.local:3875/heartbeat/<secret-key>` senden.

## Anfragen an die Probe senden

Ersetzen Sie die öffentliche Heartbeat-URL:

```
https://visca.ai/heartbeat/<secret-key>
```

durch die Ingress-URL der Probe:

```
http://<probe-host>:<PROBE_INGRESS_PORT>/heartbeat/<secret-key>
```

### Beispiele

```bash
# GET-Heartbeat
curl http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY

# POST-Heartbeat mit JSON-Text
curl -X POST http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY \
  -H "Content-Type: application/json" \
  -d '{"status": "healthy", "version": "1.2.3"}'

# Cron-Job
*/5 * * * * curl -s http://probe.internal:3875/heartbeat/YOUR_SECRET_KEY > /dev/null
```

## Weiterleitungsverhalten

- **Synchrone Antwort, asynchrone Weiterleitung.** Die Probe bestätigt die eingehende Anfrage sofort mit `200` und leitet an Cast Operations im Hintergrund weiter.
- **Header werden beibehalten.** Alle Header außer Hop-by-Hop-Headern werden weitergeleitet.
- **Text wird beibehalten.** JSON-, URL-kodierte und rohe `application/octet-stream`-Payloads bis zu **50 MB** werden akzeptiert.
- **Wiederholungsversuche mit Backoff.** Bei Fehlschlag wiederholt die Probe bis zu `PROBE_INGRESS_FORWARD_RETRY_LIMIT`-mal mit exponentiellem Backoff.

## Umgebungsvariablen

| Variable                            | Standard                      | Beschreibung                                                                         |
| ----------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| `PROBE_INGRESS_PORT`                | _nicht gesetzt_ (deaktiviert) | Port, an dem der eingehende Listener bindet. Jeder Wert `> 0` aktiviert den Ingress. |
| `PROBE_INGRESS_FORWARD_TIMEOUT_MS`  | `10000`                       | Timeout (ms) für jeden Weiterleitungsversuch an Cast Operations. Minimum `1000`.           |
| `PROBE_INGRESS_FORWARD_RETRY_LIMIT` | `3`                           | Anzahl der Wiederholungsversuche, bevor die Probe eine Weiterleitung aufgibt.        |

## Sicherheitsüberlegungen

- **Der Endpunkt ist bewusst nicht authentifiziert** — der geheime Schlüssel im URL-Pfad _ist_ die Authentifizierung. Behandeln Sie den geheimen Schlüssel als Anmeldedatum.
- **Nur an eine private Schnittstelle binden.** Der Ingress-Listener sollte nicht vom öffentlichen Internet erreichbar sein.
- **HTTPS-Terminierung verwenden, wenn Sie Verschlüsselung im Transit benötigen.** Der Listener der Probe spricht einfaches HTTP.

## Verwandte Themen

- [Benutzerdefinierte Probes](/docs/probe/custom-probe)
- [Eingehender Anfrage-Monitor](/docs/monitor/incoming-request-monitor)

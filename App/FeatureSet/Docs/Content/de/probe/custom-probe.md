## Benutzerdefinierte Probes einrichten

Sie können benutzerdefinierte Probes in Ihrem Netzwerk einrichten, um Ressourcen in Ihrem privaten Netzwerk oder Ressourcen hinter Ihrer Firewall zu überwachen.

Um zu beginnen, müssen Sie eine benutzerdefinierte Probe in Ihren Projekteinstellungen > Probe erstellen. Sobald Sie die benutzerdefinierte Probe im Cast Operations-Dashboard erstellt haben, sollten Sie die `PROBE_ID` und den `PROBE_KEY` haben.

### Probe bereitstellen

#### Docker

Um eine Probe auszuführen, stellen Sie sicher, dass Docker installiert ist. Sie können eine benutzerdefinierte Probe folgendermaßen ausführen:

```
docker run --name cast-operations-probe --network host -e PROBE_KEY=<probe-key> -e PROBE_ID=<probe-id> -e CAST_OPERATIONS_URL=https://latticeruntime.com -d cast-operations/probe:release
```

Wenn Sie Cast Operations selbst hosten, können Sie `CAST_OPERATIONS_URL` auf Ihre benutzerdefinierte selbst gehostete Instanz ändern.

##### Proxy-Konfiguration

Wenn Ihre Probe einen Proxy-Server verwenden muss, um Cast Operations oder externe Ressourcen zu erreichen, können Sie Proxy-Einstellungen über diese Umgebungsvariablen konfigurieren:

```
# Für HTTP-Proxy
docker run --name cast-operations-probe --network host \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://latticeruntime.com \
  -e HTTP_PROXY_URL=http://proxy.example.com:8080 \
  -e NO_PROXY=localhost,.internal.example.com \
  -d cast-operations/probe:release

# Für HTTPS-Proxy
docker run --name cast-operations-probe --network host \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://latticeruntime.com \
  -e HTTPS_PROXY_URL=http://proxy.example.com:8080 \
  -e NO_PROXY=localhost,.internal.example.com \
  -d cast-operations/probe:release

# Mit Proxy-Authentifizierung
docker run --name cast-operations-probe --network host \
  -e PROBE_KEY=<probe-key> \
  -e PROBE_ID=<probe-id> \
  -e CAST_OPERATIONS_URL=https://latticeruntime.com \
  -e HTTP_PROXY_URL=http://username:password@proxy.example.com:8080 \
  -e HTTPS_PROXY_URL=http://username:password@proxy.example.com:8080 \
  -e NO_PROXY=localhost,.internal.example.com \
  -d cast-operations/probe:release
```

#### Docker Compose

Sie können die Probe auch mit docker-compose ausführen. Erstellen Sie eine `docker-compose.yml`-Datei mit folgendem Inhalt:

```yaml
version: "3"

services:
  cast-operations-probe:
    image: cast-operations/probe:release
    container_name: cast-operations-probe
    environment:
      - PROBE_KEY=<probe-key>
      - PROBE_ID=<probe-id>
      - CAST_OPERATIONS_URL=https://latticeruntime.com
    network_mode: host
    restart: always
```

##### Mit Proxy-Konfiguration

Wenn Sie einen Proxy-Server verwenden müssen, können Sie Proxy-Umgebungsvariablen hinzufügen:

```yaml
version: "3"

services:
  cast-operations-probe:
    image: cast-operations/probe:release
    container_name: cast-operations-probe
    environment:
      - PROBE_KEY=<probe-key>
      - PROBE_ID=<probe-id>
      - CAST_OPERATIONS_URL=https://latticeruntime.com
      # Proxy-Konfiguration (optional)
      - HTTP_PROXY_URL=http://proxy.example.com:8080
      - HTTPS_PROXY_URL=http://proxy.example.com:8080
      - NO_PROXY=localhost,.internal.example.com
    network_mode: host
    restart: always
```

Führen Sie dann den folgenden Befehl aus:

```
docker compose up -d
```

#### Kubernetes

Sie können die Probe auch mit Kubernetes ausführen. Erstellen Sie eine `cast-operations-probe.yaml`-Datei mit folgendem Inhalt:

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
              value: "https://latticeruntime.com"
```

Führen Sie dann den folgenden Befehl aus:

```bash
kubectl apply -f cast-operations-probe.yaml
```

### Umgebungsvariablen

Die Probe unterstützt die folgenden Umgebungsvariablen:

#### Erforderliche Variablen

- `PROBE_KEY` - Der Probe-Schlüssel aus Ihrem Cast Operations-Dashboard
- `PROBE_ID` - Die Probe-ID aus Ihrem Cast Operations-Dashboard
- `CAST_OPERATIONS_URL` - Die URL Ihrer Cast Operations-Instanz (Standard: https://latticeruntime.com)

#### Optionale Variablen

- `HTTP_PROXY_URL` - HTTP-Proxy-Server-URL für HTTP-Anfragen
- `HTTPS_PROXY_URL` - HTTP-Proxy-Server-URL für HTTPS-Anfragen
- `NO_PROXY` - Kommagetrennte Hosts oder Domains, die den Proxy umgehen sollen
- `PROBE_NAME` - Benutzerdefinierter Name für die Probe
- `PROBE_DESCRIPTION` - Beschreibung für die Probe
- `PROBE_MONITORING_WORKERS` - Anzahl der Überwachungs-Worker (Standard: 1)
- `PROBE_MONITOR_FETCH_LIMIT` - Anzahl der gleichzeitig abzurufenden Monitore (Standard: 10)
- `PROBE_MONITOR_RETRY_LIMIT` - Anzahl der Wiederholungsversuche für fehlgeschlagene Monitore (Standard: 3)
- `PROBE_SYNTHETIC_MONITOR_SCRIPT_TIMEOUT_IN_MS` - Timeout für synthetische Monitor-Skripte in Millisekunden (Standard: 60000)
- `PROBE_CUSTOM_CODE_MONITOR_SCRIPT_TIMEOUT_IN_MS` - Timeout für benutzerdefinierte Code-Monitor-Skripte in Millisekunden (Standard: 60000)

### Verifizieren

Wenn die Probe erfolgreich läuft, sollte sie in Ihrem Cast Operations-Dashboard als `Verbunden` angezeigt werden. Falls sie nicht als verbunden angezeigt wird, müssen Sie die Container-Logs prüfen. Wenn Sie weiterhin Probleme haben, erstellen Sie bitte ein Issue auf [GitHub](https://github.com/autonomy-cloud/operations) oder [kontaktieren Sie den Support](https://latticeruntime.com/support)

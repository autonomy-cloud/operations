# Skripting und CI/CD

Die Cast Operations CLI ist für die Automatisierung konzipiert. Sie unterstützt umgebungsvariablenbasierte Authentifizierung, JSON-Ausgabe für programmatisches Parsen und entsprechende Exit-Codes für die Pipeline-Integration.

## Umgebungsvariablen

Setzen Sie diese Umgebungsvariablen, um sich ohne gespeicherte Kontexte zu authentifizieren:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://latticeruntime.com
```

Diese haben Vorrang vor gespeicherten Kontexten, werden aber von CLI-Flags überschrieben.

## Exit-Codes

| Code | Bedeutung                                                       |
| ---- | --------------------------------------------------------------- |
| `0`  | Erfolg                                                          |
| `1`  | Allgemeiner Fehler                                              |
| `2`  | Authentifizierungsfehler (fehlende oder ungültige Anmeldedaten) |
| `3`  | Nicht gefunden (404)                                            |

Verwenden Sie Exit-Codes in Skripten zur Fehlerbehandlung:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## JSON-Verarbeitung mit jq

Verwenden Sie `-o json`, um maschinenlesbare Ausgabe zu erzeugen:

```bash
# Alle Incident-Titel extrahieren
cast-operations incident list -o json | jq '.[].title'

# Die ID eines neu erstellten Monitors abrufen
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Incidents nach Schweregrad zählen
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Ressourcen aus Dateien erstellen

Verwenden Sie `--file`, um Ressourcen aus JSON-Dateien zu erstellen – nützlich für versionsverwaltete Infrastruktur:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Batch-Vorgänge

Mehrere Ressourcen in einer Schleife verarbeiten:

```bash
# Mehrere Monitore aus einer JSON-Array-Datei erstellen
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## CI/CD-Pipeline-Beispiele

### GitHub Actions

```yaml
name: Check Active Incidents
on:
  schedule:
    - cron: "*/5 * * * *"

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Install Cast Operations CLI
        run: npm install -g @cast-operations/cli

      - name: Check for active incidents
        env:
          CAST_OPERATIONS_API_KEY: ${{ secrets.CAST_OPERATIONS_API_KEY }}
          CAST_OPERATIONS_URL: https://latticeruntime.com
        run: |
          INCIDENT_COUNT=$(cast-operations incident count)
          if [ "$INCIDENT_COUNT" -gt 0 ]; then
            echo "WARNING: $INCIDENT_COUNT incidents found"
            exit 1
          fi
```

### Generisches CI/CD-Skript

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Einen Deployment-Incident erstellen und die ID erfassen
# Hinweis: currentIncidentStateId und incidentSeverityId müssen auf vorhandene Status-/Schweregrad-IDs in Ihrem Projekt verweisen
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Deployment-Schritte hier ausführen...

# Incident nach erfolgreichem Deployment schließen
cast-operations incident update "$INCIDENT_ID" --data '{"currentIncidentStateId":"'"$RESOLVED_STATE_ID"'"}'
```

### Docker

```dockerfile
FROM node:26-slim
RUN npm install -g @cast-operations/cli
ENV CAST_OPERATIONS_API_KEY=""
ENV CAST_OPERATIONS_URL=""
ENTRYPOINT ["cast-operations"]
```

```bash
docker run --rm \
  -e CAST_OPERATIONS_API_KEY=sk-abc123 \
  -e CAST_OPERATIONS_URL=https://latticeruntime.com \
  cast-operations-cli incident list
```

## Einen spezifischen Kontext in Skripten verwenden

Wenn Sie mehrere gespeicherte Kontexte haben, können Sie einen bestimmten gezielt ansprechen:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

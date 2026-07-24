# Scripting e CI/CD

La CLI di Cast Operations è progettata per l'automazione. Supporta l'autenticazione basata su variabili d'ambiente, output JSON per il parsing programmatico e codici di uscita appropriati per l'integrazione nelle pipeline.

## Variabili d'Ambiente

Imposta queste variabili d'ambiente per autenticarti senza contesti salvati:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://latticeruntime.com
```

Queste hanno la precedenza sui contesti salvati, ma vengono sovrascritte dai flag CLI.

## Codici di Uscita

| Codice | Significato                                                  |
| ------ | ------------------------------------------------------------ |
| `0`    | Successo                                                     |
| `1`    | Errore generico                                              |
| `2`    | Errore di autenticazione (credenziali mancanti o non valide) |
| `3`    | Non trovato (404)                                            |

Usa i codici di uscita negli script per gestire gli errori:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## Elaborazione JSON con jq

Usa `-o json` per produrre output leggibile dalle macchine:

```bash
# Estrai tutti i titoli degli incidenti
cast-operations incident list -o json | jq '.[].title'

# Ottieni l'ID di un monitor appena creato
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Conta gli incidenti per severity
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Creazione di Risorse da File

Usa `--file` per creare risorse da file JSON, utile per un'infrastruttura versionata:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Operazioni in Batch

Elabora più risorse in un ciclo:

```bash
# Crea più monitor da un file JSON array
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## Esempi di Pipeline CI/CD

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

### Script CI/CD Generico

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Crea un incidente di deployment e cattura l'ID
# Nota: currentIncidentStateId e incidentSeverityId devono fare riferimento a ID di stato/severità esistenti nel tuo progetto
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Esegui i passaggi di deployment qui...

# Risolvi l'incidente dopo un deployment riuscito
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

## Uso di un Contesto Specifico negli Script

Se hai più contesti salvati, scegli quello specifico:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

# Skriptning och CI/CD

Cast Operations CLI är utformat för automatisering. Det stöder miljövariabelbaserad autentisering, JSON-utdata för programmatisk tolkning och lämpliga avslutningskoder för pipelineintegration.

## Miljövariabler

Ange dessa miljövariabler för att autentisera utan sparade kontexter:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://latticeruntime.com
```

Dessa har prioritet över sparade kontexter men åsidosätts av CLI-flaggor.

## Avslutningskoder

| Kod | Betydelse                                                          |
| --- | ------------------------------------------------------------------ |
| `0` | Lyckades                                                           |
| `1` | Allmänt fel                                                        |
| `2` | Autentiseringsfel (saknade eller ogiltiga autentiseringsuppgifter) |
| `3` | Hittades inte (404)                                                |

Använd avslutningskoder i skript för att hantera fel:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## JSON-bearbetning med jq

Använd `-o json` för att producera maskinläsbar utdata:

```bash
# Extrahera alla incidenttitlar
cast-operations incident list -o json | jq '.[].title'

# Hämta ID:t för en nyligen skapad monitor
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Räkna incidenter efter allvarlighetsgrad
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Skapa resurser från filer

Använd `--file` för att skapa resurser från JSON-filer, vilket är användbart för versionskontrollerad infrastruktur:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Batchoperationer

Bearbeta flera resurser i en loop:

```bash
# Skapa flera monitorer från en JSON-arrayfil
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## CI/CD-pipeline-exempel

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

### Generellt CI/CD-skript

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Skapa en driftsättningsincident och fånga ID:t
# Observera: currentIncidentStateId och incidentSeverityId måste referera till befintliga tillstånds-/allvarlighetsgrades-ID:n i ditt projekt
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Kör driftsättningssteg här...

# Lös incidenten efter lyckad driftsättning
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

## Använda en specifik kontext i skript

Om du har flera sparade kontexter kan du rikta mot en specifik:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

# Scripting og CI/CD

Cast Operations CLI er designet til automatisering. Den understøtter miljøvariabelbaseret autentificering, JSON-output til programmatisk parsing og passende exit-koder til pipeline-integration.

## Miljøvariabler

Sæt disse miljøvariabler for at autentificere uden gemte kontekster:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://latticeruntime.com
```

Disse har forrang over gemte kontekster, men tilsidesættes af CLI-flag.

## Exit-koder

| Kode | Betydning                                                                |
| ---- | ------------------------------------------------------------------------ |
| `0`  | Succes                                                                   |
| `1`  | Generel fejl                                                             |
| `2`  | Autentificeringsfejl (manglende eller ugyldige legitimationsoplysninger) |
| `3`  | Ikke fundet (404)                                                        |

Brug exit-koder i scripts til at håndtere fejl:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## JSON-behandling med jq

Brug `-o json` til at producere maskinlæsbart output:

```bash
# Udtræk alle incidenttitler
cast-operations incident list -o json | jq '.[].title'

# Hent ID'et for en nyoprettet monitor
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Tæl incidents efter alvorlighed
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Oprettelse af ressourcer fra filer

Brug `--file` til at oprette ressourcer fra JSON-filer, nyttigt til versionsstyret infrastruktur:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Batchoperationer

Behandl flere ressourcer i en løkke:

```bash
# Opret flere monitorer fra en JSON-array-fil
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## CI/CD-pipeline-eksempler

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

### Generisk CI/CD-script

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Opret et deployment-incident og fang ID'et
# Bemærk: currentIncidentStateId og incidentSeverityId skal referere til eksisterende tilstands-/alvorlighedsID'er i dit projekt
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Kør deployment-trin her...

# Løs incidentet efter vellykket deployment
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

## Brug af en specifik kontekst i scripts

Hvis du har flere gemte kontekster, kan du målrette en specifik:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

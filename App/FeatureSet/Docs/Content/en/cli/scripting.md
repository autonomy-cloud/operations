# Scripting and CI/CD

The Cast Operations CLI is designed for automation. It supports environment-variable-based authentication, JSON output for programmatic parsing, and appropriate exit codes for pipeline integration.

## Environment Variables

Set these environment variables to authenticate without saved contexts:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://visca.ai
```

These take precedence over saved contexts but are overridden by CLI flags.

## Exit Codes

| Code | Meaning                                               |
| ---- | ----------------------------------------------------- |
| `0`  | Success                                               |
| `1`  | General error                                         |
| `2`  | Authentication error (missing or invalid credentials) |
| `3`  | Not found (404)                                       |

Use exit codes in scripts to handle errors:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## JSON Processing with jq

Use `-o json` to produce machine-readable output:

```bash
# Extract all incident titles
cast-operations incident list -o json | jq '.[].title'

# Get the ID of a newly created monitor
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Count incidents by severity
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Creating Resources from Files

Use `--file` to create resources from JSON files, useful for version-controlled infrastructure:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Batch Operations

Process multiple resources in a loop:

```bash
# Create multiple monitors from a JSON array file
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## CI/CD Pipeline Examples

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
          CAST_OPERATIONS_URL: https://visca.ai
        run: |
          INCIDENT_COUNT=$(cast-operations incident count)
          if [ "$INCIDENT_COUNT" -gt 0 ]; then
            echo "WARNING: $INCIDENT_COUNT incidents found"
            exit 1
          fi
```

### Generic CI/CD Script

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Create a deployment incident and capture the ID
# Note: currentIncidentStateId and incidentSeverityId must reference existing state/severity IDs in your project
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Run deployment steps here...

# Resolve the incident after successful deployment
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
  -e CAST_OPERATIONS_URL=https://visca.ai \
  cast-operations-cli incident list
```

## Using a Specific Context in Scripts

If you have multiple contexts saved, target a specific one:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

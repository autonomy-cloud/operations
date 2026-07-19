# Scripting और CI/CD

Cast Operations CLI automation के लिए डिज़ाइन की गई है। यह environment-variable-based authentication, programmatic parsing के लिए JSON output और pipeline integration के लिए उचित exit codes का समर्थन करती है।

## Environment Variables

Saved contexts के बिना authenticate करने के लिए इन environment variables को सेट करें:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://visca.ai
```

ये saved contexts पर प्राथमिकता लेते हैं लेकिन CLI flags द्वारा override होते हैं।

## Exit Codes

| Code | अर्थ                                                    |
| ---- | ------------------------------------------------------- |
| `0`  | सफल                                                     |
| `1`  | सामान्य त्रुटि                                          |
| `2`  | Authentication त्रुटि (credentials अनुपस्थित या अमान्य) |
| `3`  | नहीं मिला (404)                                         |

त्रुटियों को handle करने के लिए scripts में exit codes उपयोग करें:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## jq के साथ JSON Processing

Machine-readable output के लिए `-o json` उपयोग करें:

```bash
# सभी incident titles निकालें
cast-operations incident list -o json | jq '.[].title'

# नए बनाए गए monitor की ID प्राप्त करें
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# severity के अनुसार incidents गिनें
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## फ़ाइलों से Resources बनाएं

version-controlled infrastructure के लिए उपयोगी JSON फ़ाइलों से resources बनाने के लिए `--file` उपयोग करें:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Batch Operations

एक loop में कई resources process करें:

```bash
# JSON array फ़ाइल से कई monitors बनाएं
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## CI/CD Pipeline उदाहरण

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

# एक deployment incident बनाएं और ID capture करें
# नोट: currentIncidentStateId और incidentSeverityId को आपके project में मौजूदा state/severity IDs को reference करना चाहिए
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# यहाँ deployment steps चलाएं...

# सफल deployment के बाद incident resolve करें
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

## Scripts में एक Specific Context का उपयोग

यदि आपके पास कई saved contexts हैं, तो एक specific को target करें:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

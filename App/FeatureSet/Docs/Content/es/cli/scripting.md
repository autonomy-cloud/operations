# Scripting y CI/CD

La CLI de Cast Operations está diseñada para la automatización. Admite autenticación basada en variables de entorno, salida JSON para análisis programático y códigos de salida apropiados para la integración en pipelines.

## Variables de entorno

Establece estas variables de entorno para autenticarte sin contextos guardados:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://latticeruntime.com
```

Estas tienen prioridad sobre los contextos guardados, pero son reemplazadas por los indicadores de CLI.

## Códigos de salida

| Código | Significado                                                 |
| ------ | ----------------------------------------------------------- |
| `0`    | Éxito                                                       |
| `1`    | Error general                                               |
| `2`    | Error de autenticación (credenciales faltantes o inválidas) |
| `3`    | No encontrado (404)                                         |

Usa los códigos de salida en scripts para manejar errores:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## Procesamiento JSON con jq

Usa `-o json` para producir salida legible por máquinas:

```bash
# Extraer todos los títulos de incidentes
cast-operations incident list -o json | jq '.[].title'

# Obtener el ID de un monitor recién creado
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Contar incidentes por severidad
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Creación de recursos desde archivos

Usa `--file` para crear recursos desde archivos JSON, útil para infraestructura versionada:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Operaciones por lotes

Procesa múltiples recursos en un bucle:

```bash
# Crear múltiples monitores desde un archivo de arreglo JSON
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## Ejemplos de pipelines de CI/CD

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

### Script genérico de CI/CD

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Crear un incidente de despliegue y capturar el ID
# Nota: currentIncidentStateId e incidentSeverityId deben hacer referencia a IDs de estado/severidad existentes en tu proyecto
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Ejecutar pasos de despliegue aquí...

# Resolver el incidente tras un despliegue exitoso
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

## Uso de un contexto específico en scripts

Si tienes múltiples contextos guardados, apunta a uno específico:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

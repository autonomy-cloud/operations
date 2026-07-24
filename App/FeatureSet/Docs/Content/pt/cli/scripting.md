# Scripting e CI/CD

O CLI do Cast Operations é projetado para automação. Suporta autenticação baseada em variáveis de ambiente, saída JSON para análise programática e códigos de saída apropriados para integração em pipelines.

## Variáveis de Ambiente

Defina estas variáveis de ambiente para autenticar sem contextos salvos:

```bash
export CAST_OPERATIONS_API_KEY=sk-sua-chave-de-api
export CAST_OPERATIONS_URL=https://latticeruntime.com
```

Estas têm precedência sobre contextos salvos, mas são substituídas por flags de CLI.

## Códigos de Saída

| Código | Significado                                              |
| ------ | -------------------------------------------------------- |
| `0`    | Sucesso                                                  |
| `1`    | Erro geral                                               |
| `2`    | Erro de autenticação (credenciais ausentes ou inválidas) |
| `3`    | Não encontrado (404)                                     |

Use códigos de saída em scripts para lidar com erros:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Falha ao listar monitores"
  exit 1
fi
```

## Processamento JSON com jq

Use `-o json` para produzir saída legível por máquina:

```bash
# Extrair todos os títulos de incidentes
cast-operations incident list -o json | jq '.[].title'

# Obter o ID de um monitor recém-criado
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Monitor criado: $NEW_ID"

# Contar incidentes por severidade
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Criando Recursos a Partir de Arquivos

Use `--file` para criar recursos a partir de arquivos JSON, útil para infraestrutura controlada por versão:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Operações em Lote

Processar múltiplos recursos em um loop:

```bash
# Criar múltiplos monitores a partir de um arquivo de array JSON
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## Exemplos de Pipeline de CI/CD

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

### Script Genérico de CI/CD

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Criar um incidente de implantação e capturar o ID
# Nota: currentIncidentStateId e incidentSeverityId devem referenciar IDs de estado/severidade existentes no seu projeto
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Execute as etapas de implantação aqui...

# Resolver o incidente após implantação bem-sucedida
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

## Usando um Contexto Específico em Scripts

Se você tiver múltiplos contextos salvos, direcione para um específico:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

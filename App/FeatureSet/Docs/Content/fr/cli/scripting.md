# Scripts et CI/CD

Le CLI Cast Operations est conçu pour l'automatisation. Il prend en charge l'authentification par variables d'environnement, la sortie JSON pour l'analyse programmatique, et des codes de sortie appropriés pour l'intégration dans les pipelines.

## Variables d'environnement

Définissez ces variables d'environnement pour vous authentifier sans contextes sauvegardés :

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://visca.ai
```

Ces variables ont la priorité sur les contextes sauvegardés mais sont remplacées par les indicateurs CLI.

## Codes de sortie

| Code | Signification                                                   |
| ---- | --------------------------------------------------------------- |
| `0`  | Succès                                                          |
| `1`  | Erreur générale                                                 |
| `2`  | Erreur d'authentification (identifiants manquants ou invalides) |
| `3`  | Introuvable (404)                                               |

Utilisez les codes de sortie dans les scripts pour gérer les erreurs :

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## Traitement JSON avec jq

Utilisez `-o json` pour produire une sortie lisible par machine :

```bash
# Extraire tous les titres d'incidents
cast-operations incident list -o json | jq '.[].title'

# Obtenir l'identifiant d'un moniteur nouvellement créé
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Compter les incidents par gravité
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Création de ressources depuis des fichiers

Utilisez `--file` pour créer des ressources depuis des fichiers JSON, utile pour l'infrastructure versionnée :

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Opérations par lots

Traiter plusieurs ressources dans une boucle :

```bash
# Créer plusieurs moniteurs depuis un tableau JSON dans un fichier
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## Exemples de pipelines CI/CD

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

### Script CI/CD générique

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Créer un incident de déploiement et capturer l'identifiant
# Note : currentIncidentStateId et incidentSeverityId doivent référencer des identifiants d'état/gravité existants dans votre projet
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Exécutez les étapes de déploiement ici...

# Résoudre l'incident après un déploiement réussi
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

## Utilisation d'un contexte spécifique dans les scripts

Si vous avez plusieurs contextes sauvegardés, ciblez-en un spécifique :

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

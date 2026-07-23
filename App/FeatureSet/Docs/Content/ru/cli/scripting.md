# Скриптинг и CI/CD

CLI Cast Operations разработан для автоматизации. Он поддерживает аутентификацию на основе переменных окружения, JSON-вывод для программного разбора и соответствующие коды завершения для интеграции с конвейерами.

## Переменные окружения

Установите эти переменные окружения для аутентификации без сохранённых контекстов:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://latticeruntime.com
```

Они имеют приоритет над сохранёнными контекстами, но переопределяются флагами CLI.

## Коды завершения

| Код | Значение                                                          |
| --- | ----------------------------------------------------------------- |
| `0` | Успех                                                             |
| `1` | Общая ошибка                                                      |
| `2` | Ошибка аутентификации (отсутствующие или неверные учётные данные) |
| `3` | Не найдено (404)                                                  |

Используйте коды завершения в скриптах для обработки ошибок:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## Обработка JSON с помощью jq

Используйте `-o json` для получения машиночитаемого вывода:

```bash
# Извлечение всех заголовков инцидентов
cast-operations incident list -o json | jq '.[].title'

# Получение ID только что созданного монитора
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# Подсчёт инцидентов по серьёзности
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## Создание ресурсов из файлов

Используйте `--file` для создания ресурсов из JSON-файлов, что удобно для инфраструктуры под управлением версий:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## Пакетные операции

Обработка нескольких ресурсов в цикле:

```bash
# Создание нескольких мониторов из файла JSON-массива
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## Примеры конвейеров CI/CD

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

### Общий скрипт CI/CD

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# Создание инцидента деплоя и захват ID
# Примечание: currentIncidentStateId и incidentSeverityId должны ссылаться на существующие ID состояния/серьёзности в вашем проекте
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# Здесь выполняются шаги деплоя...

# Разрешение инцидента после успешного деплоя
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

## Использование конкретного контекста в скриптах

Если у вас сохранено несколько контекстов, выберите нужный:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

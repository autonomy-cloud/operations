# Операции с ресурсами

CLI Cast Operations предоставляет полные CRUD-операции (создание, чтение, обновление, удаление) для всех поддерживаемых ресурсов. Ресурсы автоматически обнаруживаются из вашего экземпляра Cast Operations.

## Доступные ресурсы

Выполните следующую команду, чтобы просмотреть все доступные типы ресурсов:

```bash
cast-operations resources
```

Вы можете фильтровать по типу:

```bash
# Показать только ресурсы базы данных
cast-operations resources --type database

# Показать только аналитические ресурсы
cast-operations resources --type analytics
```

Распространённые ресурсы включают:

| Ресурс                               | Команда                                 |
| ------------------------------------ | --------------------------------------- |
| Инцидент                             | `cast-operations incident`                    |
| Алерт                                | `cast-operations alert`                       |
| Монитор                              | `cast-operations monitor`                     |
| Статус монитора                      | `cast-operations monitor-status`              |
| Состояние инцидента                  | `cast-operations incident-state`              |
| Страница статуса                     | `cast-operations status-page`                 |
| Политика дежурства                   | `cast-operations on-call-policy`              |
| Команда                              | `cast-operations team`                        |
| Запланированное событие обслуживания | `cast-operations scheduled-maintenance-event` |

## Список ресурсов

Получение списка ресурсов с опциональной фильтрацией, пагинацией и сортировкой.

```bash
cast-operations <resource> list [options]
```

**Опции:**

| Опция                   | Описание                            | По умолчанию |
| ----------------------- | ----------------------------------- | ------------ |
| `--query <json>`        | Критерии фильтрации в формате JSON  | Нет          |
| `--limit <n>`           | Максимальное количество результатов | `10`         |
| `--skip <n>`            | Количество пропускаемых результатов | `0`          |
| `--sort <json>`         | Порядок сортировки в формате JSON   | Нет          |
| `-o, --output <format>` | Формат вывода                       | `table`      |

**Примеры:**

```bash
# Список 10 последних инцидентов
cast-operations incident list

# Фильтрация инцидентов по ID состояния
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# Список с пагинацией
cast-operations incident list --limit 20 --skip 40

# Сортировка по дате создания (по убыванию)
cast-operations incident list --sort '{"createdAt":-1}'

# Вывод в формате JSON
cast-operations incident list -o json
```

## Получение ресурса

Получение одного ресурса по его ID.

```bash
cast-operations <resource> get <id>
```

**Аргументы:**

| Аргумент | Описание          |
| -------- | ----------------- |
| `<id>`   | ID ресурса (UUID) |

**Примеры:**

```bash
# Получение конкретного инцидента
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Получение монитора в формате JSON
cast-operations monitor get abc-123 -o json
```

## Создание ресурса

Создание нового ресурса из встроенного JSON или файла.

```bash
cast-operations <resource> create [options]
```

**Опции:**

| Опция                   | Описание                            |
| ----------------------- | ----------------------------------- |
| `--data <json>`         | Данные ресурса в виде JSON-объекта  |
| `--file <path>`         | Путь к JSON-файлу с данными ресурса |
| `-o, --output <format>` | Формат вывода                       |

Необходимо указать либо `--data`, либо `--file`.

**Примеры:**

```bash
# Создание инцидента с встроенным JSON
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Создание из JSON-файла
cast-operations incident create --file incident.json

# Создание и вывод в формате JSON для захвата ID
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## Обновление ресурса

Обновление существующего ресурса по ID.

```bash
cast-operations <resource> update <id> [options]
```

**Аргументы:**

| Аргумент | Описание   |
| -------- | ---------- |
| `<id>`   | ID ресурса |

**Опции:**

| Опция                   | Описание                                         |
| ----------------------- | ------------------------------------------------ |
| `--data <json>`         | Поля для обновления в формате JSON (обязательно) |
| `-o, --output <format>` | Формат вывода                                    |

**Примеры:**

```bash
# Изменение состояния инцидента (например, на resolved)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Переименование монитора
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## Удаление ресурса

Удаление ресурса по ID.

```bash
cast-operations <resource> delete <id> [--force]
```

**Аргументы:**

| Аргумент | Описание   |
| -------- | ---------- |
| `<id>`   | ID ресурса |

**Опции:**

| Опция     | Описание                        |
| --------- | ------------------------------- |
| `--force` | Пропустить запрос подтверждения |

**Примеры:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Пропуск подтверждения
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## Подсчёт ресурсов

Подсчёт ресурсов, соответствующих опциональным критериям фильтрации.

```bash
cast-operations <resource> count [options]
```

**Опции:**

| Опция            | Описание                           |
| ---------------- | ---------------------------------- |
| `--query <json>` | Критерии фильтрации в формате JSON |

**Примеры:**

```bash
# Подсчёт всех инцидентов
cast-operations incident count

# Подсчёт инцидентов по состоянию
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Подсчёт мониторов
cast-operations monitor count
```

## Аналитические ресурсы

Аналитические ресурсы поддерживают ограниченный набор операций по сравнению с ресурсами базы данных:

| Операция | Поддерживается |
| -------- | -------------- |
| `list`   | Да             |
| `create` | Да             |
| `count`  | Да             |
| `get`    | Нет            |
| `update` | Нет            |
| `delete` | Нет            |

Используйте `cast-operations resources --type analytics`, чтобы узнать, какие аналитические ресурсы доступны в вашем экземпляре.

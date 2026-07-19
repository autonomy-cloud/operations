# Аутентификация

CLI Cast Operations поддерживает несколько способов аутентификации с вашим экземпляром Cast Operations. Вы можете использовать именованные контексты, переменные окружения или передавать учётные данные непосредственно в виде флагов.

## Вход в систему

Выполните аутентификацию в вашем экземпляре Cast Operations с помощью ключа API:

```bash
cast-operations login <api-key> <instance-url>
```

**Аргументы:**

| Аргумент         | Описание                                                            |
| ---------------- | ------------------------------------------------------------------- |
| `<api-key>`      | Ваш ключ API Cast Operations (например, `sk-your-api-key`)                |
| `<instance-url>` | URL вашего экземпляра Cast Operations (например, `https://visca.ai`) |

**Опции:**

| Опция                   | Описание                                            |
| ----------------------- | --------------------------------------------------- |
| `--context-name <name>` | Имя для этого контекста (по умолчанию: `"default"`) |

**Примеры:**

```bash
# Вход с контекстом по умолчанию
cast-operations login sk-abc123 https://visca.ai

# Вход с именованным контекстом
cast-operations login sk-abc123 https://visca.ai --context-name production

# Настройка нескольких сред
cast-operations login sk-prod-key https://visca.ai --context-name production
cast-operations login sk-staging-key https://staging.visca.ai --context-name staging
```

## Контексты

Контексты позволяют сохранять и переключаться между несколькими средами Cast Operations (например, production, staging, development).

### Список контекстов

```bash
cast-operations context list
```

Отображает все настроенные контексты. Текущий контекст отмечен символом `*`.

### Переключение контекста

```bash
cast-operations context use <name>
```

Переключается на другой именованный контекст для всех последующих команд.

```bash
# Переключение на staging
cast-operations context use staging

# Переключение на production
cast-operations context use production
```

### Просмотр текущего контекста

```bash
cast-operations context current
```

Отображает активный контекст, включая URL экземпляра и скрытый ключ API.

### Удаление контекста

```bash
cast-operations context delete <name>
```

Удаляет именованный контекст. Если удалённый контекст является текущим, CLI автоматически переключается на первый оставшийся контекст.

## Разрешение учётных данных

Учётные данные разрешаются в следующем порядке приоритета:

1. **Флаги CLI** (`--api-key` и `--url`)
2. **Переменные окружения** (`CAST_OPERATIONS_API_KEY` и `CAST_OPERATIONS_URL`)
3. **Именованный контекст** (через флаг `--context`)
4. **Текущий контекст** (из сохранённой конфигурации)

Вы можете комбинировать источники — например, использовать переменную окружения для ключа API и сохранённый контекст для URL.

### Использование флагов CLI

```bash
cast-operations --api-key sk-abc123 --url https://visca.ai incident list
```

### Использование переменных окружения

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://visca.ai

cast-operations incident list
```

### Использование конкретного контекста

```bash
cast-operations --context production incident list
```

## Проверка аутентификации

Проверьте текущий статус аутентификации:

```bash
cast-operations whoami
```

Отображает:

- URL экземпляра
- Скрытый ключ API
- Имя текущего контекста (отображается только при активном сохранённом контексте)

Если аутентификация не выполнена, команда выводит полезное сообщение с предложением выполнить `cast-operations login`.

## Файл конфигурации

Учётные данные хранятся в `~/.cast-operations/config.json` с ограниченными правами доступа (`0600`).

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://visca.ai",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.visca.ai",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```

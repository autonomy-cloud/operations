# Провайдер Terraform для Cast Operations

Провайдер Terraform для Cast Operations позволяет управлять ресурсами Cast Operations с помощью Infrastructure as Code (IaC). Провайдер позволяет настраивать мониторинг, управление инцидентами, страницы статуса и другие функции Cast Operations через Terraform.

## Оглавление

- [Установка](#установка)
- [Настройка провайдера](#настройка-провайдера)
- [Быстрый старт](#быстрый-старт)
- [Совместимость версий](#совместимость-версий)
- [Доступные ресурсы](#доступные-ресурсы)
- [Примеры](#примеры)
- [Рекомендации](#рекомендации)
- [Руководство по миграции](#руководство-по-миграции)

## Установка

### Из Terraform Registry (рекомендуется)

Провайдер Terraform для Cast Operations доступен в [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations).

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Используйте последнюю версию 7.x
    }
  }
  required_version = ">= 1.0"
}
```

### Фиксация версии для самостоятельного хостинга

⚠️ **Важно для пользователей с самостоятельным хостингом**: всегда фиксируйте версию провайдера Terraform, совпадающую с версией вашей установки Cast Operations, для обеспечения совместимости API.

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Зафиксируйте точную версию, совпадающую с вашей установкой Cast Operations
    }
  }
  required_version = ">= 1.0"
}
```

#### Определение версии Cast Operations

Версию Cast Operations можно определить несколькими способами:

1. **Панель управления**: перейдите в Настройки → О программе в панели управления Cast Operations
2. **API**: вызовите конечную точку `GET /api/status`
3. **Docker**: проверьте используемый тег образа
4. **Helm**: проверьте версию Helm-чарта

```bash
# Пример: при запуске Cast Operations 7.0.123
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"
    }
  }
}
```

## Настройка провайдера

### Базовая конфигурация

```hcl
provider "cast-operations" {
  cast_operations_url = "https://your-operations-instance.com"  # Или https://latticeruntime.com для облака
  api_key       = var.cast_operations_api_key
}
```

### Переменные среды

Провайдер можно настроить через переменные среды:

```bash
export CAST_OPERATIONS_URL="https://your-operations-instance.com"
export CAST_OPERATIONS_API_KEY="your-api-key-here"
```

Затем используйте провайдер без явной конфигурации:

```hcl
provider "cast-operations" {
  # Конфигурация будет считана из переменных среды
}
```

### Параметры конфигурации

| Аргумент        | Переменная среды    | Описание           | Обязательно |
| --------------- | ------------------- | ------------------ | ----------- |
| `cast_operations_url` | `CAST_OPERATIONS_URL`     | URL Cast Operations      | Да          |
| `api_key`       | `CAST_OPERATIONS_API_KEY` | API-ключ Cast Operations | Да          |

## Быстрый старт

### 1. Создание API-ключа

Сначала создайте API-ключ на панели управления Cast Operations:

1. Перейдите в **Настройки** → **API-ключи**
2. Нажмите **Создать API-ключ**
3. Задайте описательное имя (например, «Terraform Automation»)
4. Выберите соответствующие разрешения
5. Скопируйте сгенерированный API-ключ

### 2. Базовая конфигурация Terraform

Создайте файл `main.tf`:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Используйте URL вашего экземпляра
  api_key       = var.cast_operations_api_key
}

# Примечание: проекты необходимо создавать вручную в панели управления Cast Operations
variable "project_id" {
  description = "Идентификатор проекта Cast Operations"
  type        = string
}

# Создание монитора
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Монитор доступности сайта"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Создание команды
resource "cast_operations_team" "platform" {
  name        = "Platform Team"
  description = "Команда платформенной инженерии"
}
    value = "alerts@example.com"
  }
}
```

### 3. Инициализация и применение

```bash
# Инициализация Terraform
terraform init

# Планирование изменений
terraform plan

# Применение конфигурации
terraform apply
```

## Совместимость версий

### Облачные пользователи

Для облачных пользователей Cast Operations используйте последнюю версию провайдера:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Всегда используйте последнюю совместимую версию
    }
  }
}
```

### Пользователи с самостоятельным хостингом

**Критически важно**: пользователи с самостоятельным хостингом должны фиксировать версию провайдера, совпадающую с их установкой Cast Operations:

| Версия Cast Operations | Версия провайдера | Конфигурация           |
| ---------------- | ----------------- | ---------------------- |
| 7.0.x            | 7.0.x             | `version = "~> 7.0.0"` |
| 7.1.x            | 7.1.x             | `version = "~> 7.1.0"` |
| 7.2.x            | 7.2.x             | `version = "~> 7.2.0"` |

Пример для Cast Operations 7.0.123:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Точное совпадение версии
    }
  }
}
```

## Доступные ресурсы

Провайдер Terraform для Cast Operations поддерживает следующие ресурсы:

### Базовые ресурсы

- `cast_operations_team` — управление командами

### Мониторинг

- `cast_operations_monitor` — создание и управление мониторами
- `cast_operations_probe` — управление зондами мониторинга

### Управление дежурством

- `cast_operations_on_call_duty_policy` — настройка расписаний дежурства

### Страницы статуса

- `cast_operations_status_page` — создание страниц статуса

### Каталог сервисов

- `cast_operations_service_catalog` — управление записями каталога сервисов

### Каталог сервисов

- `cast_operations_service` — определение сервисов
- `cast_operations_service_dependency` — отображение зависимостей сервисов

### Источники данных

Примечание: источники данных в настоящее время недоступны в провайдере, так как в схеме провайдера не определены datasources.

## Примеры

### Полная настройка мониторинга

```hcl
# Переменные
variable "cast_operations_api_key" {
  description = "API-ключ Cast Operations"
  type        = string
  sensitive   = true
}

variable "project_id" {
  description = "Идентификатор проекта Cast Operations (создайте проект вручную в панели управления)"
  type        = string
}

variable "cast_operations_url" {
  description = "URL Cast Operations"
  type        = string
  default     = "https://latticeruntime.com"
}

# Конфигурация провайдера
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = var.cast_operations_url
  api_key       = var.cast_operations_api_key
}

# Команда
resource "cast_operations_team" "platform" {
  name        = "Platform Team"
  description = "Команда платформенной инженерии"
}

# Мониторы
resource "cast_operations_monitor" "api" {
  name        = "API Health Check"
  description = "Монитор конечной точки работоспособности API"
  data        = jsonencode({
    url = "https://api.mycompany.com/health"
    method = "GET"
    interval = "1m"
    timeout = "30s"
  })
  }
}

resource "cast_operations_monitor" "database" {
  name       = "Database Connection"
  project_id = cast_operations_project.production.id

  monitor_type = "port"
  hostname     = "db.mycompany.com"
  port         = 5432
  interval     = "2m"

  tags = {
    service     = "database"
    environment = "production"
    criticality = "critical"
  }
}

# Политика дежурства
resource "cast_operations_on_call_policy" "platform_oncall" {
  name       = "Platform On-Call"
  project_id = cast_operations_project.production.id
  team_id    = cast_operations_team.platform.id

  schedules {
    name      = "Business Hours"
    timezone  = "America/New_York"

    layers {
      name = "Primary"
      users = ["user1@mycompany.com", "user2@mycompany.com"]
      rotation_type = "weekly"
      start_time = "09:00"
      end_time = "17:00"
      days = ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  }
}

# Политика оповещений
resource "cast_operations_alert_policy" "critical_alerts" {
  name       = "Critical System Alerts"
  project_id = cast_operations_project.production.id

  conditions {
    monitor_id = cast_operations_monitor.api.id
    threshold  = "down"
  }

  conditions {
    monitor_id = cast_operations_monitor.database.id
    threshold  = "down"
  }

  actions {
    type = "webhook"
    url  = "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
  }

  actions {
    type           = "oncall_escalation"
    oncall_policy_id = cast_operations_on_call_policy.platform_oncall.id
  }
}

# Страница статуса
resource "cast_operations_status_page" "public" {
  name       = "MyCompany Status"
  project_id = cast_operations_project.production.id

  domain = "status.mycompany.com"

  components {
    name       = "API"
    monitor_id = cast_operations_monitor.api.id
  }

  components {
    name       = "Database"
    monitor_id = cast_operations_monitor.database.id
  }
}
```

### Пример конфигурации для самостоятельного хостинга

```hcl
# Для самостоятельного хостинга Cast Operations версии 7.0.123
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Должно точно совпадать с версией Cast Operations
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # Ваш URL самостоятельного хостинга
  api_key       = var.cast_operations_api_key
}

# Остальная конфигурация...
```

## Рекомендации

### 1. Управление версиями

**Для облачных пользователей:**

- Используйте семантическое версионирование с `~>` для получения совместимых обновлений
- Изучайте журнал изменений перед крупными обновлениями версий

**Для пользователей с самостоятельным хостингом:**

- Всегда фиксируйте точную версию, совпадающую с вашей установкой
- Обновляйте версию провайдера при обновлении Cast Operations
- Сначала тестируйте в нерабочей среде

### 2. Управление состоянием

```hcl
terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "cast-operations/terraform.tfstate"
    region = "us-west-2"
  }
}
```

### 3. Разделение сред

Используйте рабочие пространства или отдельные файлы состояния для разных сред:

```bash
# Использование рабочих пространств
terraform workspace new production
terraform workspace new staging

# Использование отдельных каталогов
mkdir -p environments/{staging,production}
```

### 4. Управление переменными

```hcl
# variables.tf
variable "environment" {
  description = "Имя среды"
  type        = string
}

variable "monitors" {
  description = "Список мониторов для создания"
  type = list(object({
    name = string
    url  = string
    type = string
  }))
}

# terraform.tfvars
environment = "production"
monitors = [
  {
    name = "Website"
    url  = "https://example.com"
    type = "website"
  },
  {
    name = "API"
    url  = "https://api.example.com/health"
    type = "api"
  }
]
```

### 5. Именование ресурсов

Используйте согласованные соглашения об именовании:

```hcl
resource "cast_operations_monitor" "website_production" {
  name = "${var.environment}-website-monitor"
  # ...
}

resource "cast_operations_alert_policy" "critical_production" {
  name = "${var.environment}-critical-alerts"
  # ...
}
```

## Руководство по миграции

### Из ручной конфигурации

1. **Аудит существующих ресурсов** в панели управления Cast Operations
2. **Создание конфигурации Terraform** для существующих ресурсов
3. **Импорт существующих ресурсов** в состояние Terraform
4. **Валидация конфигурации** на соответствие текущему состоянию
5. **Применение изменений** постепенно

Пример импорта:

```bash
# Импорт существующего монитора
terraform import cast_operations_monitor.website monitor-id-here

# Импорт существующего проекта
terraform import cast_operations_project.main project-id-here
```

### Обновление версий

При обновлении Cast Operations (самостоятельный хостинг):

1. **Создайте резервную копию текущего состояния**
2. **Проверьте совместимость провайдера**
3. **Обновите версию провайдера** в конфигурации
4. **Протестируйте в промежуточной среде**
5. **Примените к производственной среде**

```bash
# Резервное копирование состояния
terraform state pull > backup.tfstate

# Обновление версии провайдера
# Отредактируйте блок terraform в вашей конфигурации

# Планирование и применение
terraform init -upgrade
terraform plan
terraform apply
```

## Поддержка и ресурсы

- **Документация**: [Cast Operations Docs](https://docs.latticeruntime.com)
- **Terraform Registry**: [Провайдер Cast Operations](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Issues**: [Cast Operations GitHub](https://github.com/autonomy-cloud/operations/issues)
- **Сообщество**: [Cast Operations Community](https://community.latticeruntime.com)

## Устранение неполадок

### Распространённые проблемы

1. **Несовпадение версий (самостоятельный хостинг)**

   ```
   Error: API version incompatible
   ```

   **Решение**: убедитесь, что версия провайдера совпадает с установкой Cast Operations

2. **Проблемы аутентификации**

   ```
   Error: Invalid API key
   ```

   **Решение**: проверьте API-ключ и разрешения

3. **Ресурс не найден**
   ```
   Error: Resource not found
   ```
   **Решение**: проверьте идентификаторы ресурсов и убедитесь, что ресурс существует

### Режим отладки

Включите детальное журналирование:

```bash
export TF_LOG=DEBUG
terraform apply
```

### Проверка версии

Проверьте вашу конфигурацию:

```bash
# Проверка версии Terraform
terraform version

# Проверка версии провайдера
terraform providers

# Валидация конфигурации
terraform validate
```

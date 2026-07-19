# Краткое руководство по провайдеру Terraform

Это руководство поможет вам начать работу с провайдером Terraform для Cast Operations за несколько минут.

## Предварительные требования

- Установленный Terraform >= 1.0
- Учётная запись Cast Operations (облачная или самостоятельный хостинг)
- API-ключ Cast Operations

## Шаг 1: Создание API-ключа

### Для облачного Cast Operations

1. Перейдите на [Cast Operations Cloud](https://visca.ai) и войдите в систему
2. Перейдите в **Настройки** → **API-ключи**
3. Нажмите **Создать API-ключ**
4. Назовите его «Terraform Provider»
5. Выберите необходимые разрешения
6. Скопируйте сгенерированный API-ключ

### Для Cast Operations с самостоятельным хостингом

1. Перейдите на ваш экземпляр Cast Operations
2. Перейдите в **Настройки** → **API-ключи**
3. Нажмите **Создать API-ключ**
4. Назовите его «Terraform Provider»
5. Выберите необходимые разрешения
6. Скопируйте сгенерированный API-ключ

## Шаг 2: Создание конфигурации Terraform

Создайте новый каталог и файл `main.tf`:

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # Для облачных пользователей
      version = "~> 7.0"

      # Для пользователей с самостоятельным хостингом — зафиксируйте точную версию
      # version = "= 7.0.123"  # Замените версией Cast Operations
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # Для облачных пользователей
  cast_operations_url = "https://visca.ai"

  # Для пользователей с самостоятельным хостингом — используйте URL вашего экземпляра
  # cast_operations_url = "https://operations.yourcompany.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "API-ключ Cast Operations"
  type        = string
  sensitive   = true
}

# Примечание: проекты необходимо создавать вручную в панели управления Cast Operations
# Используйте идентификатор вашего существующего проекта здесь
variable "project_id" {
  description = "Идентификатор проекта Cast Operations"
  type        = string
}

# Создание простого монитора сайта
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Монитор доступности сайта"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Вывод идентификатора монитора
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## Шаг 3: Создание файла переменных

Создайте `terraform.tfvars`:

```hcl
# terraform.tfvars
cast_operations_api_key = "your-api-key-here"
project_id        = "your-project-id-here"  # Получите из панели управления Cast Operations
```

**Важно**: добавьте `terraform.tfvars` в `.gitignore`, чтобы скрыть API-ключи!

## Шаг 4: Инициализация и применение

```bash
# Инициализация Terraform
terraform init

# Планирование развёртывания
terraform plan

# Применение конфигурации
terraform apply
```

## Шаг 5: Проверка ресурсов

1. Проверьте панель управления Cast Operations
2. Перейдите в ваш существующий проект
3. Убедитесь, что «Website Monitor» создан и работает

## Следующие шаги

1. **Изучите другие ресурсы**: ознакомьтесь с [полной документацией](./README.md) по всем доступным ресурсам
2. **Настройте оповещения**: добавьте политики оповещений и каналы уведомлений
3. **Создайте страницы статуса**: настройте публичные страницы статуса для ваших сервисов
4. **Организуйте с помощью команд**: создайте команды и назначьте разрешения

## Примеры для конкретных версий

### Облачные пользователи (последняя версия)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Всегда получает последнюю совместимую версию 7.x
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### Пользователи с самостоятельным хостингом (фиксированная версия)

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Должно точно совпадать с вашей версией Cast Operations
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # URL вашего самостоятельного хостинга
  api_key       = var.cast_operations_api_key
}
```

## Устранение неполадок при быстром старте

### Проблема: Провайдер не найден

```
Error: Failed to query available provider packages
```

**Решение**: выполните `terraform init` для загрузки провайдера

### Проблема: Ошибка аутентификации

```
Error: Invalid API key
```

**Решение**:

1. Проверьте API-ключ в панели управления Cast Operations
2. Убедитесь, что API-ключ имеет достаточные разрешения
3. Убедитесь в правильности `cast_operations_url` для вашего экземпляра

### Проблема: Несовпадение версий (самостоятельный хостинг)

```
Error: API version incompatible
```

**Решение**:

1. Проверьте версию Cast Operations в панели управления
2. Обновите версию провайдера до точного совпадения
3. Выполните `terraform init -upgrade`

## Очистка

Для удаления всех ресурсов, созданных в этом кратком руководстве:

```bash
terraform destroy
```

Это удалит монитор и проект, созданные при быстром старте.

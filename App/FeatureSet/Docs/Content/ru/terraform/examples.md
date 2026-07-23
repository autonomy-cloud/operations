# Примеры провайдера Terraform

Этот документ содержит исчерпывающие примеры типичных конфигураций Terraform для Cast Operations.

## Базовые примеры

### Простой проект

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Используйте "= 7.0.123" для самостоятельного хостинга
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Замените для самостоятельного хостинга
  api_key       = var.cast_operations_api_key
}

```

### Базовый монитор

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Монитор главной страницы сайта"
  monitor_type = "Manual"
}
```

### Страницы статуса

```hcl
# Публичная страница статуса
resource "cast_operations_status_page" "public" {
  name        = "Public Status Page"
  description = "Публичная страница статуса для пользовательских сервисов"
}
```

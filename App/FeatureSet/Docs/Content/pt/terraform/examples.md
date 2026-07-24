# Exemplos do Provedor Terraform

Este documento fornece exemplos abrangentes para configurações comuns do Cast Operations no Terraform.

## Exemplos Básicos

### Projeto Simples

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Use "= 7.0.123" para auto-hospedado
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Altere para auto-hospedado
  api_key       = var.cast_operations_api_key
}

```

### Monitor Básico

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Monitor da Página Inicial"
  description = "Monitor para a página inicial principal do site"
  monitor_type = "Manual"
}
```

### Páginas de Status

```hcl
# Página de status pública
resource "cast_operations_status_page" "public" {
  name        = "Página de Status Pública"
  description = "Página de status pública para serviços voltados ao cliente"
}
```

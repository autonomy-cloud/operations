# Ejemplos del proveedor Terraform

Este documento proporciona ejemplos completos para configuraciones comunes de Terraform en Cast Operations.

## Ejemplos básicos

### Proyecto simple

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Usa "= 7.0.123" para auto-alojado
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Cambia para auto-alojado
  api_key       = var.cast_operations_api_key
}

```

### Monitor básico

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Monitor de página principal"
  description = "Monitor para la página principal del sitio web"
  monitor_type = "Manual"
}
```

### Páginas de estado

```hcl
# Página de estado pública
resource "cast_operations_status_page" "public" {
  name        = "Página de estado pública"
  description = "Página de estado pública para servicios orientados al cliente"
}
```

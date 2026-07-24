# Terraform-Provider-Beispiele

Dieses Dokument enthält umfassende Beispiele für häufige Cast Operations-Terraform-Konfigurationen.

## Grundlegende Beispiele

### Einfaches Projekt

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Verwenden Sie "= 7.0.123" für selbst gehostete Instanzen
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Für selbst gehostete Instanzen ändern
  api_key       = var.cast_operations_api_key
}

```

### Einfacher Monitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Monitor für die Hauptwebseite"
  monitor_type = "Manual"
}
```

### Status-Seiten

```hcl
# Öffentliche Status-Seite
resource "cast_operations_status_page" "public" {
  name        = "Öffentliche Status-Seite"
  description = "Öffentliche Status-Seite für kundenseitige Dienste"
}
```

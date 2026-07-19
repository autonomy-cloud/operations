# Terraform Provider-eksempler

Dette dokument indeholder omfattende eksempler til almindelige Cast Operations Terraform-konfigurationer.

## Grundlæggende eksempler

### Simpelt projekt

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Brug "= 7.0.123" til selvhostet
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Skift til selvhostet
  api_key       = var.cast_operations_api_key
}

```

### Grundlæggende monitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Monitor til webstedets hjemmeside"
  monitor_type = "Manual"
}
```

### Statussider

```hcl
# Offentlig statusside
resource "cast_operations_status_page" "public" {
  name        = "Offentlig statusside"
  description = "Offentlig statusside til kundevendte tjenester"
}
```

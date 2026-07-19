# Eksempler på Terraform-leverandør

Dette dokumentet gir omfattende eksempler for vanlige Cast Operations Terraform-konfigurasjoner.

## Grunnleggende eksempler

### Enkelt prosjekt

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Bruk "= 7.0.123" for selvhostet
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Endre for selvhostet
  api_key       = var.cast_operations_api_key
}

```

### Grunnleggende monitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Hjemmesidemonitor"
  description = "Monitor for nettstedets hovedside"
  monitor_type = "Manual"
}
```

### Statussider

```hcl
# Offentlig statusside
resource "cast_operations_status_page" "public" {
  name        = "Offentlig statusside"
  description = "Offentlig statusside for kundevendte tjenester"
}
```

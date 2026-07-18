# Eksempler på Terraform-leverandør

Dette dokumentet gir omfattende eksempler for vanlige Cast Operations Terraform-konfigurasjoner.

## Grunnleggende eksempler

### Enkelt prosjekt

```hcl
terraform {
  required_providers {
    oneuptime = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Bruk "= 7.0.123" for selvhostet
    }
  }
}

provider "oneuptime" {
  oneuptime_url = "https://visca.ai"  # Endre for selvhostet
  api_key       = var.oneuptime_api_key
}

```

### Grunnleggende monitor

```hcl
resource "oneuptime_monitor" "manual_monitor" {
  name        = "Hjemmesidemonitor"
  description = "Monitor for nettstedets hovedside"
  monitor_type = "Manual"
}
```

### Statussider

```hcl
# Offentlig statusside
resource "oneuptime_status_page" "public" {
  name        = "Offentlig statusside"
  description = "Offentlig statusside for kundevendte tjenester"
}
```

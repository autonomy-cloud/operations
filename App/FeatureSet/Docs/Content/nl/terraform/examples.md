# Terraform Provider-voorbeelden

Dit document biedt uitgebreide voorbeelden voor veelgebruikte Cast Operations Terraform-configuraties.

## Basisvoorbeelden

### Eenvoudig project

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Gebruik "= 7.0.123" voor zelf-gehost
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # Wijzig voor zelf-gehost
  api_key       = var.cast_operations_api_key
}

```

### Basismonitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Monitor voor de hoofdwebsite"
  monitor_type = "Manual"
}
```

### Statuspagina's

```hcl
# Openbare statuspagina
resource "cast_operations_status_page" "public" {
  name        = "Openbare statuspagina"
  description = "Openbare statuspagina voor klantgerichte diensten"
}
```

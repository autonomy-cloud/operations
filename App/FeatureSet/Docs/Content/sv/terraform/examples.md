# Terraform-leverantörsexempel

Det här dokumentet innehåller omfattande exempel för vanliga Cast Operations Terraform-konfigurationer.

## Grundläggande exempel

### Enkelt projekt

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Use "= 7.0.123" for self-hosted
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # Change for self-hosted
  api_key       = var.cast_operations_api_key
}

```

### Grundläggande monitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Monitor for the main website homepage"
  monitor_type = "Manual"
}
```

### Statussidor

```hcl
# Public status page
resource "cast_operations_status_page" "public" {
  name        = "Public Status Page"
  description = "Public status page for customer-facing services"
}
```

# Terraform Provider Examples

This document provides comprehensive examples for common Cast Operations Terraform configurations.

## Basic Examples

### Simple Project

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

### Basic Monitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Monitor for the main website homepage"
  monitor_type = "Manual"
}
```

### Status Pages

```hcl
# Public status page
resource "cast_operations_status_page" "public" {
  name        = "Public Status Page"
  description = "Public status page for customer-facing services"
}
```

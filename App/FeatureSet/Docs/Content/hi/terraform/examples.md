# Terraform Provider Examples

यह document सामान्य Cast Operations Terraform configurations के लिए व्यापक उदाहरण प्रदान करता है।

## Basic Examples

### Simple Project

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # self-hosted के लिए "= 7.0.123" उपयोग करें
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # self-hosted के लिए बदलें
  api_key       = var.cast_operations_api_key
}

```

### Basic Monitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "main website homepage के लिए Monitor"
  monitor_type = "Manual"
}
```

### Status Pages

```hcl
# Public status page
resource "cast_operations_status_page" "public" {
  name        = "Public Status Page"
  description = "customer-facing services के लिए Public status page"
}
```

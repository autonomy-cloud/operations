# Terraform Provider 範例

本文件提供常見 Cast Operations Terraform 設定的完整範例。

## 基本範例

### 簡易專案

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
  cast_operations_url = "https://visca.ai"  # Change for self-hosted
  api_key       = var.cast_operations_api_key
}

```

### 基本 Monitor

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Monitor for the main website homepage"
  monitor_type = "Manual"
}
```

### 狀態頁面

```hcl
# Public status page
resource "cast_operations_status_page" "public" {
  name        = "Public Status Page"
  description = "Public status page for customer-facing services"
}
```

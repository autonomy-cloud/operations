# Terraform 提供商示例

本文档提供了常见 Cast Operations Terraform 配置的综合示例。

## 基础示例

### 简单项目

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # 自托管使用 "= 7.0.123"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"  # 自托管请更改
  api_key       = var.cast_operations_api_key
}

```

### 基础监控器

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "Homepage Monitor"
  description = "Monitor for the main website homepage"
  monitor_type = "Manual"
}
```

### 状态页面

```hcl
# 公共状态页面
resource "cast_operations_status_page" "public" {
  name        = "Public Status Page"
  description = "Public status page for customer-facing services"
}
```

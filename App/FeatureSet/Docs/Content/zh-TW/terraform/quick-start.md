# Terraform Provider 快速入門指南

本指南將協助您在短短幾分鐘內開始使用 Cast Operations Terraform Provider。

## 先決條件

- 已安裝 Terraform >= 1.0
- Cast Operations 帳號（雲端或自架）
- Cast Operations API 金鑰

## 步驟 1：建立 API 金鑰

### 適用於 Cast Operations 雲端

1. 前往 [Cast Operations Cloud](https://visca.ai) 並登入
2. 導覽至 **Settings** → **API Keys**
3. 點選 **Create API Key**
4. 將其命名為「Terraform Provider」
5. 選取所需的權限
6. 複製產生的 API 金鑰

### 適用於自架 Cast Operations

1. 存取您的 Cast Operations 執行個體
2. 導覽至 **Settings** → **API Keys**
3. 點選 **Create API Key**
4. 將其命名為「Terraform Provider」
5. 選取所需的權限
6. 複製產生的 API 金鑰

## 步驟 2：建立 Terraform 設定

建立一個新目錄與 `main.tf` 檔案：

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # For Cloud customers
      version = "~> 7.0"

      # For Self-Hosted customers - pin to your exact version
      # version = "= 7.0.123"  # Replace with your Cast Operations version
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # For Cloud customers
  cast_operations_url = "https://visca.ai"

  # For Self-Hosted customers - use your instance URL
  # cast_operations_url = "https://operations.yourcompany.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "Cast Operations API Key"
  type        = string
  sensitive   = true
}

# Note: Projects must be created manually in the Cast Operations dashboard
# Use your existing project ID here
variable "project_id" {
  description = "Cast Operations project ID"
  type        = string
}

# Create a simple website monitor
resource "cast_operations_monitor" "website" {
  name        = "Website Monitor"
  description = "Monitor for website uptime"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# Output the monitor ID
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## 步驟 3：建立變數檔案

建立 `terraform.tfvars`：

```hcl
# terraform.tfvars
cast_operations_api_key = "your-api-key-here"
project_id        = "your-project-id-here"  # Get this from Cast Operations dashboard
```

**重要**：將 `terraform.tfvars` 加入您的 `.gitignore`，以保持 API 金鑰的機密性！

## 步驟 4：初始化並套用

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply
```

## 步驟 5：驗證資源

1. 檢查您的 Cast Operations 儀表板
2. 前往您現有的專案
3. 確認「Website Monitor」已建立並正在執行

## 後續步驟

1. **探索更多資源**：查看[完整文件](./README.md)以了解所有可用的資源
2. **設定警報**：新增警報原則與通知管道
3. **建立狀態頁面**：為您的服務設定公開狀態頁面
4. **以團隊組織**：建立團隊並指派權限

## 特定版本範例

### 雲端客戶（最新版本）

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # Always gets latest compatible 7.x version
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### 自架客戶（版本鎖定）

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Must match your Cast Operations version exactly
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # Your self-hosted URL
  api_key       = var.cast_operations_api_key
}
```

## 快速入門疑難排解

### 問題：找不到 Provider

```
Error: Failed to query available provider packages
```

**解決方案**：執行 `terraform init` 以下載 provider

### 問題：驗證失敗

```
Error: Invalid API key
```

**解決方案**：

1. 在 Cast Operations 儀表板中驗證您的 API 金鑰
2. 檢查 API 金鑰是否具有足夠的權限
3. 確認 `cast_operations_url` 對於您的執行個體是正確的

### 問題：版本不符（自架）

```
Error: API version incompatible
```

**解決方案**：

1. 在儀表板中檢查您的 Cast Operations 版本
2. 將 provider 版本更新為完全相符
3. 執行 `terraform init -upgrade`

## 清理

若要移除在此快速入門中建立的所有資源：

```bash
terraform destroy
```

這將會刪除在快速入門期間建立的監視器與專案。

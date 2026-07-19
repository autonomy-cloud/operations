# Terraform Provider 文件

Cast Operations Terraform Provider 讓您能以基礎設施即程式碼（Infrastructure as Code，IaC）的方式管理 Cast Operations 的監控、警示與可觀測性資源。

## 📚 文件章節

### [快速入門](./quick-start.md)

快速設定指南，讓您在幾分鐘內開始使用 Cast Operations Terraform Provider。

### [完整 Provider 指南](./README.md)

涵蓋安裝、設定、資源與最佳實務的完整文件。

### [自架設定](./self-hosted.md)

**對自架客戶至關重要**：版本鎖定、相容性與部署策略。

### [範例](./examples.md)

常見 Cast Operations Terraform 設定的真實範例與模式。

## 🚀 快速連結

### 適用於 Cast Operations Cloud 客戶

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### 適用於自架客戶

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Must match your Cast Operations version
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## ⚠️ 自架使用者的重要事項

**版本相容性至關重要**：請務必將 Terraform provider 版本鎖定為與您的 Cast Operations 安裝版本完全相符。版本不一致可能導致 API 相容性問題。

## 🔗 外部資源

- **Terraform Registry**: [Cast Operations Provider](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub Repository**: [Cast Operations Source Code](https://github.com/autonomy-cloud/operations)
- **社群支援**: [Cast Operations Community](https://community.visca.ai)

## 📋 可用資源

此 provider 支援完整的 Cast Operations 資源管理：

- **專案與團隊**：組織您的監控結構
- **監控器**：網站、API、連接埠、心跳與自訂監控器
- **事件管理**：警示政策、待命排程、升級
- **狀態頁面**：具備自訂品牌樣式的公開與私人狀態頁面
- **服務目錄**：服務定義與相依關係對應
- **工作流程**：自動化回應與修復工作流程

## 🛠️ 支援

如有問題、疑問或想貢獻：

1. **文件問題**：在 [Cast Operations repository](https://github.com/autonomy-cloud/operations/issues) 建立 issue
2. **Provider 錯誤**：回報至 Cast Operations 主 repository
3. **功能請求**：於 Cast Operations 社群討論
4. **一般問題**：使用社群論壇

## 🎯 後續步驟

1. **新使用者**：從[快速入門指南](./quick-start.md)開始
2. **自架**：檢視[自架設定](./self-hosted.md)
3. **進階使用者**：探索[範例](./examples.md)以了解複雜的設定
4. **完整參考**：查閱[完整指南](./README.md)以了解所有功能

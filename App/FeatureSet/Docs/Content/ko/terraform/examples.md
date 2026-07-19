# Terraform 공급자 예시

이 문서는 일반적인 Cast Operations Terraform 구성에 대한 포괄적인 예시를 제공합니다.

## 기본 예시

### 간단한 프로젝트

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # 자체 호스팅의 경우 "= 7.0.123" 사용
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # 자체 호스팅의 경우 변경
  api_key       = var.cast_operations_api_key
}

```

### 기본 모니터

```hcl
resource "cast_operations_monitor" "manual_monitor" {
  name        = "홈페이지 모니터"
  description = "메인 웹사이트 홈페이지를 위한 모니터"
  monitor_type = "Manual"
}
```

### 상태 페이지

```hcl
# 공개 상태 페이지
resource "cast_operations_status_page" "public" {
  name        = "공개 상태 페이지"
  description = "고객 대면 서비스를 위한 공개 상태 페이지"
}
```

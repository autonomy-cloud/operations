# Terraform 공급자 문서

Cast Operations Terraform 공급자를 통해 Cast Operations 모니터링, 알림 및 관측 가능성 리소스를 인프라 코드(IaC)로 관리할 수 있습니다.

## 문서 섹션

### [시작하기](./quick-start.md)

몇 분 안에 Cast Operations Terraform 공급자를 시작하기 위한 빠른 설정 가이드.

### [완전한 공급자 가이드](./README.md)

설치, 구성, 리소스 및 모범 사례를 다루는 포괄적인 문서.

### [자체 호스팅 구성](./self-hosted.md)

**자체 호스팅 고객에게 중요**: 버전 고정, 호환성 및 배포 전략.

### [예시](./examples.md)

일반적인 Cast Operations Terraform 구성을 위한 실제 예시 및 패턴.

## 빠른 링크

### Cast Operations 클라우드 고객의 경우

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

### 자체 호스팅 고객의 경우

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Cast Operations 버전과 일치해야 함
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"
  api_key       = var.cast_operations_api_key
}
```

## 자체 호스팅 사용자에게 중요

**버전 호환성이 중요합니다**: Terraform 공급자 버전을 항상 Cast Operations 설치 버전과 정확히 일치하도록 고정합니다. 버전이 일치하지 않으면 API 호환성 문제가 발생할 수 있습니다.

## 외부 리소스

- **Terraform 레지스트리**: [Cast Operations 공급자](https://registry.terraform.io/providers/autonomy-cloud/operations)
- **GitHub 저장소**: [Cast Operations 소스 코드](https://github.com/autonomy-cloud/operations)
- **커뮤니티 지원**: [Cast Operations 커뮤니티](https://community.visca.ai)

## 사용 가능한 리소스

공급자는 포괄적인 Cast Operations 리소스 관리를 지원합니다:

- **프로젝트 및 팀**: 모니터링 구조 구성
- **모니터**: 웹사이트, API, 포트, 하트비트 및 커스텀 모니터
- **인시던트 관리**: 알림 정책, 온콜 일정, 에스컬레이션
- **상태 페이지**: 커스텀 브랜딩이 있는 공개 및 비공개 상태 페이지
- **서비스 카탈로그**: 서비스 정의 및 종속성 매핑
- **워크플로**: 자동화된 응답 및 수정 워크플로

## 지원

문제, 질문 또는 기여를 위해:

1. **문서 문제**: [Cast Operations 저장소](https://github.com/autonomy-cloud/operations/issues)에서 이슈 생성
2. **공급자 버그**: 메인 Cast Operations 저장소에서 보고
3. **기능 요청**: Cast Operations 커뮤니티에서 토론
4. **일반 질문**: 커뮤니티 포럼 사용

## 다음 단계

1. **신규 사용자**: [빠른 시작 가이드](./quick-start.md)로 시작합니다
2. **자체 호스팅**: [자체 호스팅 구성](./self-hosted.md)을 검토합니다
3. **고급 사용자**: 복잡한 설정을 위한 [예시](./examples.md)를 살펴봅니다
4. **전체 참조**: 모든 기능에 대한 [완전한 가이드](./README.md)를 확인합니다

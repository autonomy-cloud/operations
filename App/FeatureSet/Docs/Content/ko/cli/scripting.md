# 스크립팅 및 CI/CD

Cast Operations CLI는 자동화를 위해 설계되었습니다. 환경 변수 기반 인증, 프로그래밍 방식 파싱을 위한 JSON 출력, 파이프라인 통합을 위한 적절한 종료 코드를 지원합니다.

## 환경 변수

저장된 컨텍스트 없이 인증하려면 다음 환경 변수를 설정합니다:

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://visca.ai
```

이 변수들은 저장된 컨텍스트보다 우선하지만 CLI 플래그에 의해 재정의됩니다.

## 종료 코드

| 코드 | 의미                                    |
| ---- | --------------------------------------- |
| `0`  | 성공                                    |
| `1`  | 일반 오류                               |
| `2`  | 인증 오류 (누락되거나 잘못된 자격 증명) |
| `3`  | 찾을 수 없음 (404)                      |

스크립트에서 종료 코드를 사용하여 오류를 처리합니다:

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## jq를 사용한 JSON 처리

기계 판독 가능한 출력을 생성하려면 `-o json`을 사용합니다:

```bash
# 모든 인시던트 제목 추출
cast-operations incident list -o json | jq '.[].title'

# 새로 생성된 모니터의 ID 가져오기
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# 심각도별 인시던트 카운트
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## 파일에서 리소스 생성

버전 제어된 인프라에 유용한 JSON 파일에서 리소스를 생성하려면 `--file`을 사용합니다:

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## 배치 작업

루프에서 여러 리소스를 처리합니다:

```bash
# JSON 배열 파일에서 여러 모니터 생성
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## CI/CD 파이프라인 예시

### GitHub Actions

```yaml
name: Check Active Incidents
on:
  schedule:
    - cron: "*/5 * * * *"

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - name: Install Cast Operations CLI
        run: npm install -g @cast-operations/cli

      - name: Check for active incidents
        env:
          CAST_OPERATIONS_API_KEY: ${{ secrets.CAST_OPERATIONS_API_KEY }}
          CAST_OPERATIONS_URL: https://visca.ai
        run: |
          INCIDENT_COUNT=$(cast-operations incident count)
          if [ "$INCIDENT_COUNT" -gt 0 ]; then
            echo "WARNING: $INCIDENT_COUNT incidents found"
            exit 1
          fi
```

### 일반 CI/CD 스크립트

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# 배포 인시던트 생성 및 ID 캡처
# 참고: currentIncidentStateId와 incidentSeverityId는 프로젝트의 기존 상태/심각도 ID를 참조해야 합니다
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# 배포 단계 실행...

# 성공적인 배포 후 인시던트 해결
cast-operations incident update "$INCIDENT_ID" --data '{"currentIncidentStateId":"'"$RESOLVED_STATE_ID"'"}'
```

### Docker

```dockerfile
FROM node:26-slim
RUN npm install -g @cast-operations/cli
ENV CAST_OPERATIONS_API_KEY=""
ENV CAST_OPERATIONS_URL=""
ENTRYPOINT ["cast-operations"]
```

```bash
docker run --rm \
  -e CAST_OPERATIONS_API_KEY=sk-abc123 \
  -e CAST_OPERATIONS_URL=https://visca.ai \
  cast-operations-cli incident list
```

## 스크립트에서 특정 컨텍스트 사용

여러 컨텍스트가 저장된 경우 특정 컨텍스트를 대상으로 지정합니다:

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

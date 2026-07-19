# 脚本与 CI/CD

Cast Operations CLI 专为自动化而设计。它支持基于环境变量的认证、用于程序化解析的 JSON 输出，以及适合流水线集成的退出码。

## 环境变量

设置以下环境变量，无需保存上下文即可进行认证：

```bash
export CAST_OPERATIONS_API_KEY=sk-your-api-key
export CAST_OPERATIONS_URL=https://visca.ai
```

这些变量优先于已保存的上下文，但会被 CLI 标志覆盖。

## 退出码

| 代码 | 含义                       |
| ---- | -------------------------- |
| `0`  | 成功                       |
| `1`  | 通用错误                   |
| `2`  | 认证错误（凭据缺失或无效） |
| `3`  | 未找到（404）              |

在脚本中使用退出码处理错误：

```bash
if ! cast-operations monitor list > /dev/null 2>&1; then
  echo "Failed to list monitors"
  exit 1
fi
```

## 使用 jq 处理 JSON

使用 `-o json` 生成机器可读的输出：

```bash
# 提取所有事件标题
cast-operations incident list -o json | jq '.[].title'

# 获取新创建监控器的 ID
NEW_ID=$(cast-operations monitor create --data '{"name":"API Health"}' -o json | jq -r '._id')
echo "Created monitor: $NEW_ID"

# 按严重程度统计事件
cast-operations incident count --query '{"incidentSeverityId":"<severity-id>"}'
```

## 从文件创建资源

使用 `--file` 从 JSON 文件创建资源，适用于版本控制的基础设施：

```bash
# monitor.json
# {
#   "name": "API Health Check",
#   "projectId": "your-project-id"
# }

cast-operations monitor create --file monitor.json
```

## 批量操作

在循环中处理多个资源：

```bash
# 从 JSON 数组文件创建多个监控器
cat monitors.json | jq -r '.[] | @json' | while read monitor; do
  cast-operations monitor create --data "$monitor"
done
```

## CI/CD 流水线示例

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

### 通用 CI/CD 脚本

```bash
#!/bin/bash
set -e

export CAST_OPERATIONS_API_KEY="$CI_CAST_OPERATIONS_API_KEY"
export CAST_OPERATIONS_URL="$CI_CAST_OPERATIONS_URL"

# 创建部署事件并捕获 ID
# 注意：currentIncidentStateId 和 incidentSeverityId 必须引用您项目中已存在的状态/严重程度 ID
INCIDENT_ID=$(cast-operations incident create --data '{
  "title": "Deployment Started",
  "currentIncidentStateId": "'"$INVESTIGATING_STATE_ID"'",
  "incidentSeverityId": "'"$SEVERITY_ID"'",
  "declaredAt": "'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"
}' -o json | jq -r '._id')

# 在此处运行部署步骤...

# 成功部署后解决事件
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

## 在脚本中使用特定上下文

如果您保存了多个上下文，可以针对特定上下文：

```bash
cast-operations --context production incident list
cast-operations --context staging monitor count
```

# 資源操作

Cast Operations CLI 為所有支援的資源提供完整的 CRUD（建立、讀取、更新、刪除）操作。資源會自動從您的 Cast Operations 實例中探索取得。

## 可用資源

執行以下命令以查看所有可用的資源類型：

```bash
cast-operations resources
```

您可以依類型篩選：

```bash
# Show only database resources
cast-operations resources --type database

# Show only analytics resources
cast-operations resources --type analytics
```

常見資源包括：

| 資源                        | 命令                                    |
| --------------------------- | --------------------------------------- |
| Incident                    | `cast-operations incident`                    |
| Alert                       | `cast-operations alert`                       |
| Monitor                     | `cast-operations monitor`                     |
| Monitor Status              | `cast-operations monitor-status`              |
| Incident State              | `cast-operations incident-state`              |
| Status Page                 | `cast-operations status-page`                 |
| On-Call Policy              | `cast-operations on-call-policy`              |
| Team                        | `cast-operations team`                        |
| Scheduled Maintenance Event | `cast-operations scheduled-maintenance-event` |

## 列出資源

擷取資源清單，並可選擇性地進行篩選、分頁與排序。

```bash
cast-operations <resource> list [options]
```

**選項：**

| 選項                    | 說明                   | 預設值  |
| ----------------------- | ---------------------- | ------- |
| `--query <json>`        | 以 JSON 表示的篩選條件 | None    |
| `--limit <n>`           | 結果的最大數量         | `10`    |
| `--skip <n>`            | 要略過的結果數量       | `0`     |
| `--sort <json>`         | 以 JSON 表示的排序順序 | None    |
| `-o, --output <format>` | 輸出格式               | `table` |

**範例：**

```bash
# List the 10 most recent incidents
cast-operations incident list

# Filter incidents by state ID
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# List with pagination
cast-operations incident list --limit 20 --skip 40

# Sort by creation date (descending)
cast-operations incident list --sort '{"createdAt":-1}'

# Output as JSON
cast-operations incident list -o json
```

## 取得資源

依資源 ID 擷取單一資源。

```bash
cast-operations <resource> get <id>
```

**引數：**

| 引數   | 說明            |
| ------ | --------------- |
| `<id>` | 資源 ID（UUID） |

**範例：**

```bash
# Get a specific incident
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# Get a monitor as JSON
cast-operations monitor get abc-123 -o json
```

## 建立資源

從內嵌 JSON 或檔案建立新資源。

```bash
cast-operations <resource> create [options]
```

**選項：**

| 選項                    | 說明                         |
| ----------------------- | ---------------------------- |
| `--data <json>`         | 以 JSON 物件表示的資源資料   |
| `--file <path>`         | 包含資源資料的 JSON 檔案路徑 |
| `-o, --output <format>` | 輸出格式                     |

您必須提供 `--data` 或 `--file` 其中之一。

**範例：**

```bash
# Create an incident with inline JSON
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# Create from a JSON file
cast-operations incident create --file incident.json

# Create and output as JSON to capture the ID
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## 更新資源

依 ID 更新現有資源。

```bash
cast-operations <resource> update <id> [options]
```

**引數：**

| 引數   | 說明    |
| ------ | ------- |
| `<id>` | 資源 ID |

**選項：**

| 選項                    | 說明                             |
| ----------------------- | -------------------------------- |
| `--data <json>`         | 以 JSON 表示要更新的欄位（必填） |
| `-o, --output <format>` | 輸出格式                         |

**範例：**

```bash
# Change incident state (e.g., to resolved)
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# Rename a monitor
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## 刪除資源

依 ID 刪除資源。

```bash
cast-operations <resource> delete <id> [--force]
```

**引數：**

| 引數   | 說明    |
| ------ | ------- |
| `<id>` | 資源 ID |

**選項：**

| 選項      | 說明         |
| --------- | ------------ |
| `--force` | 略過確認提示 |

**範例：**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# Skip confirmation
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## 計算資源數量

計算符合選用篩選條件的資源數量。

```bash
cast-operations <resource> count [options]
```

**選項：**

| 選項             | 說明                   |
| ---------------- | ---------------------- |
| `--query <json>` | 以 JSON 表示的篩選條件 |

**範例：**

```bash
# Count all incidents
cast-operations incident count

# Count incidents by state
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# Count monitors
cast-operations monitor count
```

## 分析資源

相較於資料庫資源，分析資源支援的操作較為有限：

| 操作     | 是否支援 |
| -------- | -------- |
| `list`   | 是       |
| `create` | 是       |
| `count`  | 是       |
| `get`    | 否       |
| `update` | 否       |
| `delete` | 否       |

使用 `cast-operations resources --type analytics` 可查看您的實例上有哪些分析資源可供使用。

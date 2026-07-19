# 命令参考

Cast Operations CLI 所有命令的完整参考。

## 认证命令

### `cast-operations login`

向 Cast Operations 实例进行认证。

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| 参数             | 类型 | 是否必填 | 描述                            |
| ---------------- | ---- | -------- | ------------------------------- |
| `<api-key>`      | 参数 | 是       | 用于认证的 API 密钥             |
| `<instance-url>` | 参数 | 是       | Cast Operations 实例 URL              |
| `--context-name` | 选项 | 否       | 上下文名称（默认：`"default"`） |

---

### `cast-operations context list`

列出所有已保存的上下文。

```bash
cast-operations context list
```

---

### `cast-operations context use`

切换到命名上下文。

```bash
cast-operations context use <name>
```

| 参数     | 类型 | 是否必填 | 描述               |
| -------- | ---- | -------- | ------------------ |
| `<name>` | 参数 | 是       | 要激活的上下文名称 |

---

### `cast-operations context current`

显示带有掩码 API 密钥的活动上下文。

```bash
cast-operations context current
```

---

### `cast-operations context delete`

删除已保存的上下文。

```bash
cast-operations context delete <name>
```

| 参数     | 类型 | 是否必填 | 描述               |
| -------- | ---- | -------- | ------------------ |
| `<name>` | 参数 | 是       | 要删除的上下文名称 |

---

## 资源命令

所有资源命令遵循相同的模式。将 `<resource>` 替换为任何支持的资源名称（例如 `incident`、`monitor`、`alert`、`status-page`）。

### `cast-operations <resource> list`

列出资源，支持过滤和分页。

```bash
cast-operations <resource> list [options]
```

| 选项             | 类型   | 默认值  | 描述                |
| ---------------- | ------ | ------- | ------------------- |
| `--query <json>` | 字符串 | 无      | JSON 格式的过滤条件 |
| `--limit <n>`    | 数字   | `10`    | 最大结果数          |
| `--skip <n>`     | 数字   | `0`     | 跳过的结果数        |
| `--sort <json>`  | 字符串 | 无      | JSON 格式的排序顺序 |
| `-o, --output`   | 字符串 | `table` | 输出格式            |

---

### `cast-operations <resource> get`

通过 ID 获取单个资源。

```bash
cast-operations <resource> get <id> [-o <format>]
```

| 参数           | 类型 | 是否必填 | 描述            |
| -------------- | ---- | -------- | --------------- |
| `<id>`         | 参数 | 是       | 资源 ID（UUID） |
| `-o, --output` | 选项 | 否       | 输出格式        |

---

### `cast-operations <resource> create`

创建新资源。

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| 选项            | 类型   | 是否必填                    | 描述                |
| --------------- | ------ | --------------------------- | ------------------- |
| `--data <json>` | 字符串 | `--data` 或 `--file` 二选一 | JSON 格式的资源数据 |
| `--file <path>` | 字符串 | `--data` 或 `--file` 二选一 | JSON 文件的路径     |
| `-o, --output`  | 字符串 | 否                          | 输出格式            |

---

### `cast-operations <resource> update`

更新现有资源。

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| 参数            | 类型 | 是否必填 | 描述                  |
| --------------- | ---- | -------- | --------------------- |
| `<id>`          | 参数 | 是       | 资源 ID               |
| `--data <json>` | 选项 | 是       | JSON 格式的待更新字段 |
| `-o, --output`  | 选项 | 否       | 输出格式              |

---

### `cast-operations <resource> delete`

删除资源。

```bash
cast-operations <resource> delete <id> [--force]
```

| 参数      | 类型 | 是否必填 | 描述         |
| --------- | ---- | -------- | ------------ |
| `<id>`    | 参数 | 是       | 资源 ID      |
| `--force` | 选项 | 否       | 跳过确认提示 |

---

### `cast-operations <resource> count`

统计符合过滤条件的资源数量。

```bash
cast-operations <resource> count [--query <json>]
```

| 选项             | 类型   | 默认值 | 描述                |
| ---------------- | ------ | ------ | ------------------- |
| `--query <json>` | 字符串 | 无     | JSON 格式的过滤条件 |

---

## 实用命令

### `cast-operations version`

显示 CLI 版本。

```bash
cast-operations version
```

---

### `cast-operations whoami`

显示当前认证详情。

```bash
cast-operations whoami
```

显示实例 URL 和掩码后的 API 密钥。如果活动的已保存上下文处于活动状态，还会显示上下文名称。

---

### `cast-operations resources`

列出所有可用的资源类型。

```bash
cast-operations resources [--type <type>]
```

| 选项            | 类型   | 默认值 | 描述                              |
| --------------- | ------ | ------ | --------------------------------- |
| `--type <type>` | 字符串 | 无     | 按 `database` 或 `analytics` 过滤 |

---

## 全局选项

这些标志可用于所有命令：

| 选项                    | 描述                              |
| ----------------------- | --------------------------------- |
| `--api-key <key>`       | 覆盖 API 密钥                     |
| `--url <url>`           | 覆盖实例 URL                      |
| `--context <name>`      | 使用特定上下文                    |
| `-o, --output <format>` | 输出格式：`json`、`table`、`wide` |
| `--no-color`            | 禁用彩色输出                      |
| `--help`                | 显示帮助                          |
| `--version`             | 显示版本                          |

## API 路由

以下是 CLI 命令与 API 端点的映射关系，供参考：

| 命令     | 方法   | 端点                            |
| -------- | ------ | ------------------------------- |
| `list`   | POST   | `/api/<resource>/get-list`      |
| `get`    | POST   | `/api/<resource>/<id>/get-item` |
| `create` | POST   | `/api/<resource>`               |
| `update` | PUT    | `/api/<resource>/<id>/`         |
| `delete` | DELETE | `/api/<resource>/<id>/`         |
| `count`  | POST   | `/api/<resource>/count`         |

所有请求都包含用于认证的 `APIKey` 请求头。

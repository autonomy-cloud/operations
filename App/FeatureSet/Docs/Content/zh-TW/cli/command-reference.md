# 命令參考

Cast Operations CLI 所有命令的完整參考。

## 驗證命令

### `cast-operations login`

向 Cast Operations 執行個體進行驗證。

```bash
cast-operations login <api-key> <instance-url> [--context-name <name>]
```

| 參數             | 類型     | 是否必填 | 說明                            |
| ---------------- | -------- | -------- | ------------------------------- |
| `<api-key>`      | argument | 是       | 用於驗證的 API 金鑰             |
| `<instance-url>` | argument | 是       | Cast Operations 執行個體 URL          |
| `--context-name` | option   | 否       | 內容名稱（預設值：`"default"`） |

---

### `cast-operations context list`

列出所有已儲存的內容。

```bash
cast-operations context list
```

---

### `cast-operations context use`

切換至具名內容。

```bash
cast-operations context use <name>
```

| 參數     | 類型     | 是否必填 | 說明             |
| -------- | -------- | -------- | ---------------- |
| `<name>` | argument | 是       | 要啟用的內容名稱 |

---

### `cast-operations context current`

顯示目前作用中的內容，並遮罩 API 金鑰。

```bash
cast-operations context current
```

---

### `cast-operations context delete`

移除已儲存的內容。

```bash
cast-operations context delete <name>
```

| 參數     | 類型     | 是否必填 | 說明             |
| -------- | -------- | -------- | ---------------- |
| `<name>` | argument | 是       | 要刪除的內容名稱 |

---

## 資源命令

所有資源命令都遵循相同的模式。請將 `<resource>` 替換為任何受支援的資源名稱（例如 `incident`、`monitor`、`alert`、`status-page`）。

### `cast-operations <resource> list`

列出資源，並支援篩選與分頁。

```bash
cast-operations <resource> list [options]
```

| 選項             | 類型   | 預設值  | 說明                       |
| ---------------- | ------ | ------- | -------------------------- |
| `--query <json>` | string | 無      | 以 JSON 格式表示的篩選條件 |
| `--limit <n>`    | number | `10`    | 最大結果數                 |
| `--skip <n>`     | number | `0`     | 要略過的結果數             |
| `--sort <json>`  | string | 無      | 以 JSON 格式表示的排序順序 |
| `-o, --output`   | string | `table` | 輸出格式                   |

---

### `cast-operations <resource> get`

依 ID 取得單一資源。

```bash
cast-operations <resource> get <id> [-o <format>]
```

| 參數           | 類型     | 是否必填 | 說明            |
| -------------- | -------- | -------- | --------------- |
| `<id>`         | argument | 是       | 資源 ID（UUID） |
| `-o, --output` | option   | 否       | 輸出格式        |

---

### `cast-operations <resource> create`

建立新資源。

```bash
cast-operations <resource> create [--data <json> | --file <path>] [-o <format>]
```

| 選項            | 類型   | 是否必填                  | 說明                       |
| --------------- | ------ | ------------------------- | -------------------------- |
| `--data <json>` | string | `--data` 或 `--file` 擇一 | 以 JSON 格式表示的資源資料 |
| `--file <path>` | string | `--data` 或 `--file` 擇一 | JSON 檔案的路徑            |
| `-o, --output`  | string | 否                        | 輸出格式                   |

---

### `cast-operations <resource> update`

更新現有資源。

```bash
cast-operations <resource> update <id> --data <json> [-o <format>]
```

| 參數            | 類型     | 是否必填 | 說明                         |
| --------------- | -------- | -------- | ---------------------------- |
| `<id>`          | argument | 是       | 資源 ID                      |
| `--data <json>` | option   | 是       | 以 JSON 格式表示的待更新欄位 |
| `-o, --output`  | option   | 否       | 輸出格式                     |

---

### `cast-operations <resource> delete`

刪除資源。

```bash
cast-operations <resource> delete <id> [--force]
```

| 參數      | 類型     | 是否必填 | 說明         |
| --------- | -------- | -------- | ------------ |
| `<id>`    | argument | 是       | 資源 ID      |
| `--force` | option   | 否       | 略過確認提示 |

---

### `cast-operations <resource> count`

計算符合篩選條件的資源數量。

```bash
cast-operations <resource> count [--query <json>]
```

| 選項             | 類型   | 預設值 | 說明                       |
| ---------------- | ------ | ------ | -------------------------- |
| `--query <json>` | string | 無     | 以 JSON 格式表示的篩選條件 |

---

## 公用程式命令

### `cast-operations version`

顯示 CLI 版本。

```bash
cast-operations version
```

---

### `cast-operations whoami`

顯示目前的驗證詳細資訊。

```bash
cast-operations whoami
```

顯示執行個體 URL 與遮罩後的 API 金鑰。如果有作用中的已儲存內容，也會一併顯示內容名稱。

---

### `cast-operations resources`

列出所有可用的資源類型。

```bash
cast-operations resources [--type <type>]
```

| 選項            | 類型   | 預設值 | 說明                              |
| --------------- | ------ | ------ | --------------------------------- |
| `--type <type>` | string | 無     | 依 `database` 或 `analytics` 篩選 |

---

## 全域選項

下列旗標適用於所有命令：

| 選項                    | 說明                              |
| ----------------------- | --------------------------------- |
| `--api-key <key>`       | 覆寫 API 金鑰                     |
| `--url <url>`           | 覆寫執行個體 URL                  |
| `--context <name>`      | 使用特定內容                      |
| `-o, --output <format>` | 輸出格式：`json`、`table`、`wide` |
| `--no-color`            | 停用彩色輸出                      |
| `--help`                | 顯示說明                          |
| `--version`             | 顯示版本                          |

## API 路由

供參考，CLI 會將命令對應至下列 API 端點：

| 命令     | 方法   | 端點                            |
| -------- | ------ | ------------------------------- |
| `list`   | POST   | `/api/<resource>/get-list`      |
| `get`    | POST   | `/api/<resource>/<id>/get-item` |
| `create` | POST   | `/api/<resource>`               |
| `update` | PUT    | `/api/<resource>/<id>/`         |
| `delete` | DELETE | `/api/<resource>/<id>/`         |
| `count`  | POST   | `/api/<resource>/count`         |

所有請求都會包含用於驗證的 `APIKey` 標頭。

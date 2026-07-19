# リソース操作

Cast Operations CLI は、サポートされているすべてのリソースに対して完全な CRUD（作成、読み取り、更新、削除）操作を提供します。リソースは Cast Operations インスタンスから自動検出されます。

## 利用可能なリソース

以下のコマンドを実行して、利用可能なすべてのリソースタイプを確認します。

```bash
cast-operations resources
```

タイプでフィルタリングできます。

```bash
# データベースリソースのみ表示
cast-operations resources --type database

# 分析リソースのみ表示
cast-operations resources --type analytics
```

主なリソースには以下が含まれます。

| リソース                               | コマンド                                |
| -------------------------------------- | --------------------------------------- |
| インシデント                           | `cast-operations incident`                    |
| アラート                               | `cast-operations alert`                       |
| モニター                               | `cast-operations monitor`                     |
| モニターステータス                     | `cast-operations monitor-status`              |
| インシデント状態                       | `cast-operations incident-state`              |
| ステータスページ                       | `cast-operations status-page`                 |
| オンコールポリシー                     | `cast-operations on-call-policy`              |
| チーム                                 | `cast-operations team`                        |
| スケジュールされたメンテナンスイベント | `cast-operations scheduled-maintenance-event` |

## リソースの一覧表示

オプションのフィルタリング、ページネーション、ソートを使用してリソースの一覧を取得します。

```bash
cast-operations <resource> list [options]
```

**オプション:**

| オプション              | 説明                      | デフォルト |
| ----------------------- | ------------------------- | ---------- |
| `--query <json>`        | JSON 形式のフィルター条件 | なし       |
| `--limit <n>`           | 最大結果数                | `10`       |
| `--skip <n>`            | スキップする結果数        | `0`        |
| `--sort <json>`         | JSON 形式のソート順       | なし       |
| `-o, --output <format>` | 出力フォーマット          | `table`    |

**例:**

```bash
# 最新の 10 件のインシデントを一覧表示
cast-operations incident list

# 状態 ID でインシデントをフィルター
cast-operations incident list --query '{"currentIncidentStateId":"<state-id>"}'

# ページネーションで一覧表示
cast-operations incident list --limit 20 --skip 40

# 作成日で降順ソート
cast-operations incident list --sort '{"createdAt":-1}'

# JSON で出力
cast-operations incident list -o json
```

## リソースの取得

ID で単一のリソースを取得します。

```bash
cast-operations <resource> get <id>
```

**引数:**

| 引数   | 説明                |
| ------ | ------------------- |
| `<id>` | リソース ID（UUID） |

**例:**

```bash
# 特定のインシデントを取得
cast-operations incident get 550e8400-e29b-41d4-a716-446655440000

# モニターを JSON で取得
cast-operations monitor get abc-123 -o json
```

## リソースの作成

インライン JSON またはファイルから新しいリソースを作成します。

```bash
cast-operations <resource> create [options]
```

**オプション:**

| オプション              | 説明                                       |
| ----------------------- | ------------------------------------------ |
| `--data <json>`         | JSON オブジェクト形式のリソースデータ      |
| `--file <path>`         | リソースデータを含む JSON ファイルへのパス |
| `-o, --output <format>` | 出力フォーマット                           |

`--data` または `--file` のいずれかを指定する必要があります。

**例:**

```bash
# インライン JSON でインシデントを作成
cast-operations incident create --data '{"title":"API Outage","currentIncidentStateId":"<state-id>","incidentSeverityId":"<severity-id>","declaredAt":"2025-01-15T10:30:00Z"}'

# JSON ファイルから作成
cast-operations incident create --file incident.json

# JSON で出力して ID を取得
cast-operations monitor create --data '{"name":"API Health Check"}' -o json
```

## リソースの更新

ID で既存のリソースを更新します。

```bash
cast-operations <resource> update <id> [options]
```

**引数:**

| 引数   | 説明        |
| ------ | ----------- |
| `<id>` | リソース ID |

**オプション:**

| オプション              | 説明                              |
| ----------------------- | --------------------------------- |
| `--data <json>`         | JSON 形式の更新フィールド（必須） |
| `-o, --output <format>` | 出力フォーマット                  |

**例:**

```bash
# インシデント状態を変更（例: 解決済みに）
cast-operations incident update abc-123 --data '{"currentIncidentStateId":"<resolved-state-id>"}'

# モニターの名前を変更
cast-operations monitor update abc-123 --data '{"name":"Updated Monitor Name"}'
```

## リソースの削除

ID でリソースを削除します。

```bash
cast-operations <resource> delete <id> [--force]
```

**引数:**

| 引数   | 説明        |
| ------ | ----------- |
| `<id>` | リソース ID |

**オプション:**

| オプション | 説明                     |
| ---------- | ------------------------ |
| `--force`  | 確認プロンプトをスキップ |

**例:**

```bash
cast-operations incident delete abc-123
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000

# 確認をスキップ
cast-operations monitor delete 550e8400-e29b-41d4-a716-446655440000 --force
```

## リソースのカウント

オプションのフィルター条件に一致するリソースをカウントします。

```bash
cast-operations <resource> count [options]
```

**オプション:**

| オプション       | 説明                      |
| ---------------- | ------------------------- |
| `--query <json>` | JSON 形式のフィルター条件 |

**例:**

```bash
# すべてのインシデントをカウント
cast-operations incident count

# 状態別にインシデントをカウント
cast-operations incident count --query '{"currentIncidentStateId":"<state-id>"}'

# モニターをカウント
cast-operations monitor count
```

## 分析リソース

分析リソースはデータベースリソースと比較してサポートされる操作が限られています。

| 操作     | サポート |
| -------- | -------- |
| `list`   | はい     |
| `create` | はい     |
| `count`  | はい     |
| `get`    | いいえ   |
| `update` | いいえ   |
| `delete` | いいえ   |

インスタンスで利用可能な分析リソースを確認するには、`cast-operations resources --type analytics` を使用します。

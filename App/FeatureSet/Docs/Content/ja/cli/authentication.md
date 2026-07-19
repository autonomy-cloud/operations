# 認証

Cast Operations CLI は、Cast Operations インスタンスへの認証に複数の方法をサポートしています。名前付きコンテキスト、環境変数、またはフラグとして直接認証情報を渡す方法が使用できます。

## ログイン

API キーを使用して Cast Operations インスタンスに認証します。

```bash
cast-operations login <api-key> <instance-url>
```

**引数:**

| 引数             | 説明                                                        |
| ---------------- | ----------------------------------------------------------- |
| `<api-key>`      | Cast Operations API キー（例: `sk-your-api-key`）                 |
| `<instance-url>` | Cast Operations インスタンスの URL（例: `https://visca.ai`） |

**オプション:**

| オプション              | 説明                                              |
| ----------------------- | ------------------------------------------------- |
| `--context-name <name>` | このコンテキストの名前（デフォルト: `"default"`） |

**例:**

```bash
# デフォルトコンテキストでログイン
cast-operations login sk-abc123 https://visca.ai

# 名前付きコンテキストでログイン
cast-operations login sk-abc123 https://visca.ai --context-name production

# 複数の環境を設定する
cast-operations login sk-prod-key https://visca.ai --context-name production
cast-operations login sk-staging-key https://staging.visca.ai --context-name staging
```

## コンテキスト

コンテキストを使用すると、複数の Cast Operations 環境（例: 本番、ステージング、開発）を保存して切り替えることができます。

### コンテキスト一覧

```bash
cast-operations context list
```

設定されているすべてのコンテキストを表示します。現在のコンテキストには `*` が付いています。

### コンテキストの切り替え

```bash
cast-operations context use <name>
```

以降のすべてのコマンドで使用する別の名前付きコンテキストに切り替えます。

```bash
# ステージングに切り替え
cast-operations context use staging

# 本番に切り替え
cast-operations context use production
```

### 現在のコンテキストを確認する

```bash
cast-operations context current
```

インスタンス URL とマスクされた API キーを含む現在アクティブなコンテキストを表示します。

### コンテキストの削除

```bash
cast-operations context delete <name>
```

名前付きコンテキストを削除します。削除されたコンテキストが現在のコンテキストの場合、CLI は自動的に最初の残りのコンテキストに切り替わります。

## 認証情報の解決順序

認証情報は以下の優先順位で解決されます。

1. **CLI フラグ**（`--api-key` と `--url`）
2. **環境変数**（`CAST_OPERATIONS_API_KEY` と `CAST_OPERATIONS_URL`）
3. **名前付きコンテキスト**（`--context` フラグ経由）
4. **現在のコンテキスト**（保存された設定から）

複数のソースを組み合わせて使用することもできます。例えば、API キーには環境変数を使用し、URL には保存されたコンテキストを使用するなどが可能です。

### CLI フラグの使用

```bash
cast-operations --api-key sk-abc123 --url https://visca.ai incident list
```

### 環境変数の使用

```bash
export CAST_OPERATIONS_API_KEY=sk-abc123
export CAST_OPERATIONS_URL=https://visca.ai

cast-operations incident list
```

### 特定のコンテキストの使用

```bash
cast-operations --context production incident list
```

## 認証の確認

現在の認証状態を確認します。

```bash
cast-operations whoami
```

以下の情報が表示されます。

- インスタンス URL
- マスクされた API キー
- 現在のコンテキスト名（保存されたコンテキストがアクティブな場合のみ表示）

認証されていない場合、コマンドは `cast-operations login` を実行するよう提案するメッセージを表示します。

## 設定ファイル

認証情報は `~/.cast-operations/config.json` に制限されたパーミッション（`0600`）で保存されます。

```json
{
  "currentContext": "production",
  "contexts": {
    "production": {
      "name": "production",
      "apiUrl": "https://visca.ai",
      "apiKey": "sk-..."
    },
    "staging": {
      "name": "staging",
      "apiUrl": "https://staging.visca.ai",
      "apiKey": "sk-..."
    }
  },
  "defaults": {
    "output": "table",
    "limit": 10
  }
}
```

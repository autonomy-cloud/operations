# Terraform Registryのインストール・使用ガイド

## Terraform Registryからのインストール

Cast Operations Terraformプロバイダーは公式の [Terraform Registry](https://registry.terraform.io/providers/autonomy-cloud/operations) で利用可能です。

### Cast Operations Cloudユーザーの場合

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # 最新の互換バージョンを使用
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"
  api_key       = var.cast_operations_api_key
}
```

### セルフホストCast Operationsユーザーの場合

⚠️ **重要**：セルフホストのお客様はプロバイダーバージョンをCast Operationsのインストールに完全一致するよう固定する必要があります。

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # 正確なCast Operationsバージョンに置き換えてください
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  cast_operations_url = "https://operations.yourcompany.com"  # セルフホストURL
  api_key       = var.cast_operations_api_key
}
```

## セルフホストでバージョン固定が必要な理由

Cast Operations TerraformプロバイダーはCast Operations APIの仕様から自動生成されています。各Cast Operationsバージョンには以下の変更が含まれる場合があります：

- 異なるAPIエンドポイント
- 更新されたリソーススキーマ
- 新機能や削除された機能
- 変更された検証ルール

Cast Operationsのインストールと一致しないプロバイダーバージョンを使用すると、以下の問題が発生する可能性があります：

- APIの互換性エラー
- リソースの作成/更新の失敗
- 予期しない動作
- リソースステートのドリフト

## Cast Operationsのバージョン確認方法

### 方法1：ダッシュボード

1. Cast Operations ダッシュボードにログイン
2. **設定** → **About** に移動
3. バージョン番号をメモ（例：「7.0.123」）

### 方法2：API

```bash
curl https://your-operations-instance.com/api/version | jq '.version'
```

### 方法3：Docker

```bash
docker images | grep cast-operations
# タグを確認、例：cast-operations/dashboard:7.0.123
```

## プロバイダーのRegistry情報

- **Registry URL**：https://registry.terraform.io/providers/autonomy-cloud/operations
- **ソースリポジトリ**：https://github.com/autonomy-cloud/operations
- **ドキュメント**：https://registry.terraform.io/providers/autonomy-cloud/operations/latest/docs
- **リリース**：https://github.com/autonomy-cloud/operations

## バージョン互換性マトリクス

| Cast Operationsバージョン | プロバイダーバージョン | Terraform設定          |
| ------------------- | ---------------------- | ---------------------- |
| 7.0.x               | 7.0.x                  | `version = "~> 7.0.0"` |
| 7.1.x               | 7.1.x                  | `version = "~> 7.1.0"` |
| 最新Cloud           | 最新プロバイダー       | `version = "~> 7.0"`   |

## クイックスタート例

```hcl
# プロバイダーを設定
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # セルフホストの場合は調整
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://visca.ai"  # セルフホストの場合は調整
  api_key       = var.cast_operations_api_key
}

# プロジェクトを作成
resource "cast_operations_project" "example" {
  name        = "Terraform例"
  description = "Terraformで作成"
}

# ウェブサイトモニターを作成
resource "cast_operations_monitor" "website" {
  name       = "ウェブサイトモニター"
  project_id = cast_operations_project.example.id

  monitor_type = "website"
  url          = "https://example.com"
  interval     = "5m"

  tags = {
    managed_by = "terraform"
  }
}
```

## インストール手順

1. プロバイダーブロックを含む**Terraform設定を作成**する
2. **Terraformを初期化**：`terraform init`
3. **APIキーを設定**：`terraform.tfvars` にAPIキーを記述
4. **デプロイを計画**：`terraform plan`
5. **設定を適用**：`terraform apply`

## ヘルプを得る

- **完全なドキュメント**：[Terraformの完全なドキュメント](./README.md)を参照
- **セルフホストガイド**：[セルフホスト設定ガイド](./self-hosted.md)を確認
- **使用例**：[設定例](./examples.md)を参照
- **クイックスタート**：[クイックスタートガイド](./quick-start.md)に従う

## Registryの更新

新しいCast Operationsバージョンがリリースされると、プロバイダーはTerraform Registryに自動的に公開されます。Cloudユーザーはセマンティックバージョニング（`~> 7.0`）を使用して互換性のある更新を自動的に取得できます。セルフホストユーザーは正確なバージョンに固定する必要があります。

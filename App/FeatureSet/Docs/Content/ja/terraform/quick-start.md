# Terraformプロバイダー クイックスタートガイド

このガイドでは、Cast Operations Terraformプロバイダーを数分で使い始める方法を説明します。

## 前提条件

- Terraform >= 1.0 がインストール済み
- Cast Operationsアカウント（クラウドまたはセルフホスト）
- Cast Operations APIキー

## ステップ1：APIキーの作成

### Cast Operations Cloudの場合

1. [Cast Operations Cloud](https://latticeruntime.com) にアクセスしてログイン
2. **設定** → **APIキー** に移動
3. **APIキーの作成** をクリック
4. 「Terraform Provider」と名前を付ける
5. 必要な権限を選択
6. 生成されたAPIキーをコピー

### セルフホストCast Operationsの場合

1. Cast Operationsインスタンスにアクセス
2. **設定** → **APIキー** に移動
3. **APIキーの作成** をクリック
4. 「Terraform Provider」と名前を付ける
5. 必要な権限を選択
6. 生成されたAPIキーをコピー

## ステップ2：Terraform設定の作成

新しいディレクトリと `main.tf` ファイルを作成します：

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      # Cloudのお客様の場合
      version = "~> 7.0"

      # セルフホストのお客様の場合 — 正確なバージョンに固定
      # version = "= 7.0.123"  # Cast Operationsのバージョンに置き換えてください
    }
  }
  required_version = ">= 1.0"
}

provider "cast-operations" {
  # Cloudのお客様の場合
  cast_operations_url = "https://latticeruntime.com"

  # セルフホストのお客様の場合 — インスタンスURLを使用
  # cast_operations_url = "https://operations.yourcompany.com"

  api_key = var.cast_operations_api_key
}

variable "cast_operations_api_key" {
  description = "Cast Operations APIキー"
  type        = string
  sensitive   = true
}

# 注意：プロジェクトはCast Operations ダッシュボードで手動作成する必要があります
# 既存のプロジェクトIDをここに使用してください
variable "project_id" {
  description = "Cast OperationsプロジェクトID"
  type        = string
}

# シンプルなウェブサイトモニターを作成
resource "cast_operations_monitor" "website" {
  name        = "ウェブサイトモニター"
  description = "ウェブサイトの稼働時間監視"
  data        = jsonencode({
    url = "https://example.com"
    interval = "5m"
    timeout = "30s"
  })
}

# モニターIDを出力
output "monitor_id" {
  value = cast_operations_monitor.website.id
}
```

## ステップ3：変数ファイルの作成

`terraform.tfvars` を作成します：

```hcl
# terraform.tfvars
cast_operations_api_key = "your-api-key-here"
project_id        = "your-project-id-here"  # Cast Operations ダッシュボードから取得
```

**重要**：APIキーを秘密にするために `terraform.tfvars` を `.gitignore` に追加してください！

## ステップ4：初期化と適用

```bash
# Terraformを初期化
terraform init

# デプロイを計画
terraform plan

# 設定を適用
terraform apply
```

## ステップ5：リソースの確認

1. Cast Operations ダッシュボードを確認
2. 既存のプロジェクトに移動
3. 「ウェブサイトモニター」が作成されて実行されていることを確認

## 次のステップ

1. **より多くのリソースを探索する**：利用可能なすべてのリソースの[完全なドキュメント](./README.md)を確認
2. **アラートの設定**：アラートポリシーと通知チャンネルを追加
3. **ステータスページの作成**：サービスの公開ステータスページを設定
4. **チームによる整理**：チームを作成して権限を割り当てる

## バージョン別の例

### Cloudのお客様（最新バージョン）

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "~> 7.0"  # 常に最新の互換7.xバージョンを取得
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://latticeruntime.com"
  api_key       = var.cast_operations_api_key
}
```

### セルフホストのお客様（バージョン固定）

```hcl
terraform {
  required_providers {
    cast-operations = {
      source  = "autonomy-cloud/operations"
      version = "= 7.0.123"  # Cast Operationsのバージョンと完全一致させる必要あり
    }
  }
}

provider "cast-operations" {
  cast_operations_url = "https://operations.mycompany.com"  # セルフホストURL
  api_key       = var.cast_operations_api_key
}
```

## クイックスタートのトラブルシューティング

### 問題：プロバイダーが見つからない

```
Error: Failed to query available provider packages
```

**解決策**：`terraform init` を実行してプロバイダーをダウンロードする

### 問題：認証が失敗する

```
Error: Invalid API key
```

**解決策**：

1. Cast Operations ダッシュボードでAPIキーを確認する
2. APIキーに十分な権限があるか確認する
3. インスタンスの `cast_operations_url` が正しいか確認する

### 問題：バージョンの不一致（セルフホスト）

```
Error: API version incompatible
```

**解決策**：

1. ダッシュボードでCast Operationsのバージョンを確認する
2. プロバイダーのバージョンを完全一致に更新する
3. `terraform init -upgrade` を実行する

## クリーンアップ

このクイックスタートで作成したすべてのリソースを削除するには：

```bash
terraform destroy
```

これにより、クイックスタート中に作成されたモニターとプロジェクトが削除されます。

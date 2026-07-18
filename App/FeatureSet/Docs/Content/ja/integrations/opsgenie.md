# Opsgenie 連携

Cast Operations のインシデントが作成されるたびに [Opsgenie](https://www.atlassian.com/software/opsgenie) のアラートを作成し、Cast Operations が解決したときにクローズします。

この連携は**アウトバウンド**です: Cast Operations が [Opsgenie Alert API](https://docs.opsgenie.com/docs/alert-api) を呼び出します。**Incident → On Create** トリガーと **API コンポーネント**を持つ Cast Operations の **[ワークフロー](/docs/workflows/index)** を使います。

```text
Cast Operations Incident → On Create  ──►  API component (POST /v2/alerts)  ──►  Opsgenie alert
```

## 前提条件

- API インテグレーションの Opsgenie **API キー**: **Settings → Integrations → Add → API**。キーをコピーします。
- リージョンを確認します。デフォルトの API ホストは `https://api.opsgenie.com` で、EU アカウントは `https://api.eu.opsgenie.com` を使います。
- ワークフローを作成できる Cast Operations プロジェクト。

## ステップ 1 — API キーを保存する

1. **Workflows → Global Variables → Create** に移動します。
2. `OPSGENIE_KEY` という名前にして API キーを貼り付け、**Is Secret** をオンにします。

## ステップ 2 — 「アラート作成」ワークフローを作成する

1. **Workflows → Create Workflow** を開き、`Incidents → Opsgenie` という名前にして **Builder** を開きます。
2. **Incident** トリガーを **On Create** に設定して追加します。`Incident` にリネームします。
3. トリガーに接続した **API** ブロックを追加します:

   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts` _(EU の場合は `api.eu.opsgenie.com` を使用)_
   - **Headers**:

     ```text
     Authorization: GenieKey {{variable.OPSGENIE_KEY}}
     Content-Type: application/json
     ```

   - **Body**:

     ```json
     {
       "message": "{{Incident.title}}",
       "alias": "cast-operations-{{Incident._id}}",
       "description": "{{Incident.description}}",
       "priority": "P1",
       "source": "Cast Operations"
     }
     ```

   **`alias`** は Opsgenie のアラートを Cast Operations のインシデントに紐付け、後でエイリアスでクローズできるようにします。Opsgenie の認証スキームはリテラル文字列 `GenieKey` の後にスペースを挟んでキーを続ける形式であることに注意してください。

4. **Save** して有効化し、テスト用インシデントを作成します。ワークフローのログに `202 Accepted` レスポンスが表示されれば Opsgenie がアラートをキューに入れたことを意味します。

## ステップ 3 — Cast Operations の解決時にクローズする (推奨)

1. **Incident → On Update** トリガーを持つ `Close Opsgenie` という名前の**2 つ目のワークフロー**を作成します。
2. インシデントが解決済みになったことを確認する **Conditions** ブロックを追加します (`{{Incident.currentIncidentState.name}}` で分岐)。
3. **Yes** から **API** ブロックを追加します:
   - **Method**: `POST`
   - **URL**: `https://api.opsgenie.com/v2/alerts/cast-operations-{{Incident._id}}/close?identifierType=alias`
   - **Headers**: 同じ `Authorization: GenieKey {{variable.OPSGENIE_KEY}}`
   - **Body**: `{ "source": "Cast Operations", "note": "Resolved in Cast Operations" }`

Opsgenie がエイリアスでアラートを検索してクローズします。

## 優先度のマッピング (オプション)

Opsgenie の優先度は `P1`〜`P5` です。API ブロックの前に `{{Incident.incidentSeverity.name}}` で **Conditions** ブランチを追加して、Cast Operations の重大度からマッピングします。

## トラブルシューティング

- **`401`/`403`** — キーが間違っている、リージョンのホストが間違っている、またはインテグレーションにアラート作成権限がありません。**API** インテグレーションキーと対応する `api`/`api.eu` ホストを使っているか確認します。
- **クローズ時に `404`** — クローズ呼び出しの `alias` が作成呼び出しと完全に一致している必要があり、クエリ文字列に `identifierType=alias` が含まれている必要があります。
- **何も起きない** — ワークフローが **Enabled** であることを確認します。

## 次に読むべきページ

- [連携 概要](/docs/integrations/index) — パターンと認証クイックリファレンス。
- [PagerDuty](/docs/integrations/pagerduty) — PagerDuty に対する同じ考え方。
- [オンコール](/docs/on-call/incoming-call-policy) — Cast Operations の組み込みエスカレーション。

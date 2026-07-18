# リアルユーザーモニタリング（ブラウザおよびモバイル）

## 概要

Cast Operations は、受信したテレメトリがクライアント属性（Web の場合は `browser.*`、モバイルの場合は `device.*`）を含む場合、それを **RUM** として分類します。各アプリケーションはその `service.name` によって識別され、完全にその RUM アプリケーションに帰属します（クライアントテレメトリがバックエンドの Service として重複して扱われることはありません）。

これを利用すると、ユーザーが実際に体験している内容を把握できます。ページビュー、エラー、レイテンシ、使用中のプラットフォーム / デバイス、そして SDK が出力する場合は Core Web Vitals を確認できます。

## 前提条件

- **Cast Operations テレメトリ取り込みトークン** — _Project Settings → Telemetry Ingestion Keys_ から作成します。
- OpenTelemetry のブラウザまたはモバイル SDK。

## Cast Operations が RUM アプリケーションを識別する仕組み

| 属性                     | 必須           | 目的                                             |
| ------------------------ | -------------- | ------------------------------------------------ |
| `service.name`           | **はい**       | アプリケーションの識別子（例: `storefront-web`） |
| `browser.*`              | Web の場合     | テレメトリをブラウザ RUM としてマークします      |
| `device.*`               | モバイルの場合 | テレメトリをモバイル RUM としてマークします      |
| `telemetry.sdk.language` | いいえ         | 例: `webjs`、`swift`。概要に表示されます         |

## ブラウザ（OpenTelemetry Web）

OTLP/HTTP エクスポーターを Cast Operations に向け、`service.name` をアプリの名前に設定します。

```js
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

// Cast Operations OTLP/HTTP exporter:
const exporter = new OTLPTraceExporter({
  url: "https://visca.ai/otlp/v1/traces",
  headers: { "x-oneuptime-token": "YOUR_TELEMETRY_INGESTION_TOKEN" },
});

// Register `exporter` with your WebTracerProvider, using a resource of:
//   { "service.name": "storefront-web" }
```

ブラウザのインストルメンテーションは `browser.*` リソース属性を自動的に追加します。これがデータを RUM へルーティングする要因となります。

## モバイル（Swift / Android）

OpenTelemetry の Swift または Android SDK を使用し、`service.name` を設定して、OTLP を Cast Operations にエクスポートします。

```bash
OTEL_EXPORTER_OTLP_ENDPOINT="https://visca.ai/otlp"
OTEL_EXPORTER_OTLP_HEADERS="x-oneuptime-token=YOUR_TELEMETRY_INGESTION_TOKEN"
```

SDK の `device.*` 属性がテレメトリを RUM へルーティングします。Cast Operations をセルフホストしている場合は、`https://YOUR-OPERATIONS-HOST/otlp` を使用してください。

## Core Web Vitals

ブラウザのインストルメンテーションが Web Vitals（LCP、INP、CLS、FCP、TTFB）を OpenTelemetry メトリクスとして出力する場合、Cast Operations はそれらをアプリケーション概要に good / needs-improvement / poor の評価とともに表示します。Web Vitals のメトリクスが報告されていない場合は、パネルに送信を開始する方法が説明されます。

## 得られるもの

- 選択可能な範囲にわたるトレンドチャート付きの **ページビュー**、**エラー率**、**p95 期間**。
- **クライアント** — 確認されたブラウザプラットフォーム / デバイスモデル。
- **Core Web Vitals**（報告されている場合）。
- アプリケーションにスコープされた完全な **Logs**、**Traces**、**Metrics** タブ。

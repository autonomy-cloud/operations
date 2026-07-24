# Cast Operations.com の IP アドレスホワイトリスト

Cast Operations.com をご利用で、セキュリティ上の理由から当社の IP をホワイトリストに登録したい場合は、以下の手順に従ってください。

latticeruntime.com がお客様のリソースに到達できるように、ファイアウォールで以下の IP をホワイトリストに登録してください。

{{IP_WHITELIST}}

これらの IP は変更される場合があります。変更の際は事前にお知らせします。

## IP アドレスをプログラムで取得する

以下の API エンドポイントを使用して、プローブの出口 IP アドレスのリストをプログラムで取得することもできます。

```
GET https://latticeruntime.com/ip-whitelist
```

これにより、JSON レスポンスが返されます。

```json
{
  "ipWhitelist": ["<list of IPs>"]
}
```

このエンドポイントを使用して、ファイアウォールのホワイトリストを自動的に最新の状態に保つことができます。

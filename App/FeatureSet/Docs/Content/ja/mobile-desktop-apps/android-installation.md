# Android インストールガイド

Google Play ストアから **Cast Operations On-Call** ネイティブ Android アプリをインストールするか、Google Play を利用できないデバイスでは APK を直接サイドロードできます。

## 動作要件

- **Android 8.0(Oreo)以降**を搭載した Android スマートフォンまたはタブレット
- 有効な Cast Operations アカウント(またはセルフホスト Cast Operations インスタンスの URL)
- サインインおよびプッシュ通知の受信のためのインターネット接続

## 方法 1: Google Play からのインストール(推奨)

1. デバイスで **Google Play ストア** を開きます。
2. 「**Cast Operations On-Call**」を検索するか、デバイスで次のリンクを開きます:
   [https://github.com/autonomy-cloud/operations/releases](https://github.com/autonomy-cloud/operations/releases)
3. **インストール** をタップします。
4. インストール完了後、**開く** をタップするか、アプリドロワーから **Cast Operations On-Call** を起動します。

## 方法 2: APK の直接インストール

Google Play を利用できないデバイス(例: GrapheneOS、/e/OS、Huawei デバイス)では、GitHub Releases から公式 APK をインストールしてください:

1. Android デバイスで次のリンクを開きます:
   [https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk](https://github.com/autonomy-cloud/operations/releases/latest/download/cast-operations-on-call-android-app.apk)
2. プロンプトが表示されたら、不明なアプリをブラウザがインストールできるように許可します:
   **設定 → アプリ → \[ご利用のブラウザ\] → 不明なアプリのインストール → このソースを許可**。
3. ダウンロードした APK を開き、**インストール** をタップします。
4. アプリドロワーから **Cast Operations On-Call** を起動します。

APK は Play ストアリリースと同じソースから Cast Operations によりビルド・署名されています。サイドロードの場合、アプリのアップデートは自動的には行われません。新しいバージョンがリリースされたら、上記のリンクから最新の APK をダウンロードしてください。

## 初回起動とサインイン

1. **サーバー URL**
   - Cast Operations Cloud をご利用の場合は、デフォルトの `https://latticeruntime.com` のままにします。
   - セルフホスティングの場合は、Cast Operations インスタンスの URL を入力します(例: `https://operations.example.com`)。
   - アプリは続行前にサーバーが到達可能か確認します。
2. **サインイン**
   - Cast Operations アカウントのメールアドレスとパスワードを入力します。
   - 必要に応じて、次回以降の起動を迅速にするために **生体認証によるロック解除**(指紋)を有効にします。
3. **通知の許可**
   - プロンプトが表示されたら **許可** をタップし、オンコールのページ、インシデントアラート、確認応答をアプリが配信できるようにします。

## プッシュ通知

プッシュ通知は Expo Push 経由で Firebase Cloud Messaging(FCM)を通じて配信されます。オンコール中にページを確実に受け取るために、次のことを確認してください:

1. **設定 → アプリ → Cast Operations On-Call → 通知** を開き、すべてのカテゴリが有効になっていることを確認します。
2. **設定 → アプリ → Cast Operations On-Call → バッテリー** を開き、**制限なし** を選択する(またはバッテリー最適化を無効にする)ことで、OS がバックグラウンドプッシュを遅延させないようにします。
3. アプリのバックグラウンド実行を許可し、「データセーバー」の制限を無効にします。
4. Samsung デバイスをご利用の場合は、**設定 → デバイスケア → バッテリー → バックグラウンド使用の制限** で Cast Operations On-Call をオフにしてください。
5. オンコールシフト中もページが鳴るように、**おやすみモード** の例外リストに Cast Operations On-Call を追加します。

## アップデート

**Google Play:**

- アップデートは自動的にインストールされます。手動で実行するには、**Play ストア → プロフィール → アプリとデバイスの管理 → アップデート利用可能 → Cast Operations On-Call → 更新** を開きます。

**APK サイドロード:**

- 上記の GitHub Releases リンクから最新の APK を再度ダウンロードし、既存のアプリの上にインストールします。データ、サーバー URL、ログインは保持されます。

## アンインストール

1. **Cast Operations On-Call** アイコンを **長押し** し、**アンインストール** をタップします。
2. または **設定 → アプリ → Cast Operations On-Call → アンインストール** を開きます。
3. アプリの削除を確定します。

Cast Operations アカウントとオンコールスケジュールはサーバー側に保存されているため、アプリをアンインストールしても削除されません。

## トラブルシューティング

**サインイン時に「ネットワークエラー」が表示される場合:**

- **サーバー URL** が正しく、デバイスから到達可能であることを確認してください。
- 社内ネットワークまたは VPN を使用している場合は、Cast Operations インスタンスにアクセス可能であることを確認してください。
- サーバーが有効な証明書付きの HTTPS で配信されていることを確認してください。

**プッシュ通知を受信できない場合:**

- **設定 → アプリ → Cast Operations On-Call → 通知** で通知が有効になっていることを確認してください。
- Cast Operations On-Call のバッテリー最適化を無効にしてください(上記の「プッシュ通知」を参照)。
- おやすみモードがオフであるか、Cast Operations On-Call が例外リストに登録されていることを確認してください。
- サインアウトして再度サインインし、サーバーに登録されているプッシュトークンを更新してください。
- セルフホスティング利用者向け: Cast Operations インスタンスでプッシュ通知が設定されていることを確認してください(セルフホスト版の[プッシュ通知](/docs/self-hosted/push-notifications)ガイドをご覧ください)。

**生体認証によるロック解除が機能しない場合:**

- **設定 → セキュリティ → 指紋** で指紋を登録してください。
- Cast Operations On-Call アプリ内の **設定** 画面から生体認証によるロック解除を再度有効にしてください。

**APK のインストールがブロックされる場合:**

- ブラウザに不明なアプリのインストール権限を付与する必要があります(上記の「方法 2」を参照)。
- 一部のキャリアまたは企業のデバイスプロファイルではサイドロードが完全にブロックされている場合があります。その場合は、代わりに Google Play 版をご利用ください。

**起動時にアプリがクラッシュする場合:**

- Google Play または最新の APK から最新バージョンに更新してください。
- デバイスを再起動してください。
- 問題が続く場合は、アプリをアンインストールして再インストールし、再度サインインしてください。

## サポート

それでも問題が解決しない場合は、Cast Operations ダッシュボードからお問い合わせいただくか、[GitHub リポジトリ](https://github.com/autonomy-cloud/operations)で Issue を作成してください。

# Linux インストールガイド

包括的な監視とインシデント管理のために、Linux ディストリビューションにデスクトップアプリケーションとして Cast Operations をインストールします。

## インストール方法

### 方法 1: Google Chrome/Chromium（推奨）

Chrome および Chromium は、ネイティブデスクトップ統合を備えた最良の Linux PWA 体験を提供します。

#### PWA インストール手順:

1. **Chrome/Chromium で Cast Operations を開く**

   - ブラウザを起動します
   - Cast Operations インスタンスの URL に移動します
   - Cast Operations アカウントにサインインします
   - ページが完全に読み込まれるまで待ちます

2. **PWA をインストールする**

   - アドレスバーに**インストールアイコン**（⊞）を探します
   - **「Cast Operations をインストール」**をクリックします
   - または**Chrome メニュー**（⋮）→ **その他のツール** → **ショートカットを作成**を使用します

3. **インストールオプション**

   - ネイティブアプリ体験のために**「ウィンドウで開く」**をチェックします
   - 必要に応じてアプリ名をカスタマイズします
   - デスクトップショートカットの作成を選択します
   - **「インストール」**または**「作成」**をクリックします

4. **アプリを起動する**
   - アプリケーションランチャーで Cast Operations を見つけます
   - またはデスクトップショートカットを使用します
   - アプリが専用のウィンドウで開きます

### 方法 2: Firefox

Firefox は Linux で基本的なデスクトップ統合を備えた PWA インストールをサポートしています。

1. **PWA インストール**:
   - Firefox で Cast Operations を開きます
   - インストールバナーまたはプロンプトを探します
   - 利用可能な場合は**「インストール」**をクリックします
   - 注意: Chrome と比較してデスクトップ統合が制限されています

### 方法 3: Microsoft Edge

Edge は Linux でも利用可能で、優れた PWA サポートを提供します。

1. **PWA をインストールする**: Chrome の方法と同じ手順に従います

## 更新とメンテナンス

### 自動更新

Cast Operations PWA は自動的に更新されます:

- ブラウザがアプリを更新すると更新が適用されます
- 重要なセキュリティ更新が即時にデプロイされます
- 手動の操作は不要です

## アンインストール

### ブラウザ別の削除

```bash
# Chrome PWA の管理
google-chrome chrome://apps/

# Cast Operations 関連のすべてのブラウザデータを削除
rm -rf ~/.config/google-chrome/Default/Local\ Storage/leveldb/
rm -rf ~/.cache/google-chrome/Default/
```

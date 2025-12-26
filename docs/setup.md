# セットアップ手順

[< README に戻る](../README.md)

## 前提条件

### DevContainer環境（推奨）

- **Visual Studio Code**
- **Dev Containers拡張機能** (`ms-vscode-remote.remote-containers`)
- **Docker Desktop 4.x 以上**

### ローカル環境（DevContainerを使わない場合）

- Node.js 22.x 以上（package.jsonのenginesで指定）
- npm 10.x 以上

## 環境構築

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd template_vuetify
```

### 2. VS Code Dev Containerで開く（推奨）

#### 初回セットアップ

1. **VS Codeでプロジェクトフォルダを開く**
   ```bash
   code .
   ```

2. **Dev Containers拡張機能のインストール**（未インストールの場合）
   - 拡張機能IDで検索: `ms-vscode-remote.remote-containers`
   - またはVS Code内で「Dev Containers」を検索してインストール

3. **コンテナで開き直す**
   - コマンドパレット（`Ctrl+Shift+P` / `Cmd+Shift+P`）を開く
   - **「Dev Containers: Reopen in Container」** を選択
   - または画面右下の通知から **「Reopen in Container」** をクリック

4. **コンテナのビルドを待つ**
   - 初回は数分かかる場合があります
   - VS Code画面右下に進行状況が表示されます

5. **環境変数ファイルの作成**
   ```bash
   cp .env.example .env
   ```

   必要に応じて `.env` ファイルを編集してください。

6. **パッケージのインストール**
   ```bash
   npm install
   ```

7. **開発サーバーの起動**
   ```bash
   npm run dev
   ```

#### 2回目以降の起動

1. VS Codeでプロジェクトフォルダを開く
2. 自動的にコンテナで開くか、通知から「Reopen in Container」を選択
3. `npm run dev` で開発サーバーを起動

### 3. ローカル環境での起動（非推奨）

DevContainerを使わない場合：

```bash
# 環境変数ファイルの作成
cp .env.example .env

# パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## 動作確認

ブラウザで http://localhost:4000 にアクセスし、ウェルカムページが表示されることを確認してください。

## トラブルシューティング

### Dev Containerが起動しない

**症状**: 「Reopen in Container」が失敗する

**対処法**:
1. Docker Desktopが起動していることを確認
2. コマンドパレットから「Dev Containers: Rebuild Container」を実行
3. それでも失敗する場合は、Dockerイメージをクリーンビルド：
   ```bash
   # VS Codeを閉じてから実行
   docker compose down
   docker compose build --no-cache
   ```

### ポートが使用中の場合

**症状**: `npm run dev` で「Port 4000 is already in use」エラー

**対処法**:
```bash
# コンテナ内でポートを使用しているプロセスを確認
lsof -i :4000

# 別のポートを使用する場合は nuxt.config.ts を編集
# または .env ファイルでポートを変更
```

### パッケージインストールが失敗する

**症状**: `npm install` でエラーが発生

**対処法**:
```bash
# node_modulesとロックファイルを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### VS Codeの拡張機能が動作しない

**症状**: ESLintやVolarなどの拡張機能が認識されない

**対処法**:
1. コンテナ内に拡張機能がインストールされているか確認
2. [.devcontainer/devcontainer.json](.devcontainer/devcontainer.json) に拡張機能が定義されているか確認
3. コンテナを再ビルド：「Dev Containers: Rebuild Container」

### Docker Desktopのリソース不足

**症状**: コンテナが遅い、またはビルドが失敗する

**対処法**:
1. Docker Desktopの設定を開く
2. Resources > Advanced でメモリを4GB以上に設定
3. Docker Desktopを再起動

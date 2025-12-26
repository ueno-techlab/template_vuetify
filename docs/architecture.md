# アーキテクチャ

[< README に戻る](../README.md)

## 概要

このテンプレートは、Vue3 + Nuxt4をベースとしたSPA（Single Page Application）として設計されています。

## 技術選定理由

### Nuxt 4（SPAモード）

- ファイルベースルーティング
- 自動インポート機能
- モジュールエコシステム
- 開発体験の向上
- 新しい`app/`ディレクトリ構造による起動高速化

### Vuetify 3

- マテリアルデザイン準拠
- 豊富なコンポーネント
- TypeScriptサポート
- アクセシビリティ対応

### Pinia

- Vue3公式推奨の状態管理
- TypeScript完全対応
- Devtools統合
- モジュラー設計

## 設定ファイル

### nuxt.config.ts

```typescript
{
  ssr: false,           // SPAモード
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxt/eslint',     // ESLint統合
  ],
  typescript: {
    strict: true,       // 厳密な型チェック
    typeCheck: true,    // ビルド時型チェック
  },
}
```

### eslint.config.mjs（ESLint 9 flat config）

```javascript
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(prettierRecommended, {
  rules: {
    // カスタムルール
  },
})
```

### TypeScript設定

- `strict: true` - 全ての厳密チェックを有効化
- `noUncheckedIndexedAccess: true` - 配列アクセスの安全性向上
- `exactOptionalPropertyTypes: true` - オプショナルプロパティの厳密化

## 状態管理パターン

```
┌─────────────────────────────────────────────────┐
│                   Components                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │  Page   │  │  Card   │  │  Form   │        │
│  └────┬────┘  └────┬────┘  └────┬────┘        │
│       │            │            │              │
│       ▼            ▼            ▼              │
│  ┌─────────────────────────────────────────┐   │
│  │              Composables                 │   │
│  │   (ロジックの再利用・カプセル化)          │   │
│  └────────────────────┬────────────────────┘   │
│                       │                        │
│                       ▼                        │
│  ┌─────────────────────────────────────────┐   │
│  │              Pinia Stores                │   │
│  │   (グローバル状態・キャッシュ)            │   │
│  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## ビルド・デプロイ

### 開発

```bash
npm run dev
```

### プロダクションビルド

```bash
npm run generate  # 静的サイト生成
# または
npm run build     # SSR用ビルド（SPAでも使用可）
```

### 出力先

- `.output/` - ビルド成果物
- `.output/public/` - 静的ファイル（CDNデプロイ用）

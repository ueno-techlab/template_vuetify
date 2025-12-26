# 開発ガイド

[< README に戻る](../README.md)

## コーディング規約

### TypeScript

- 厳密モード（strict: true）を使用
- any型の使用は禁止
- 未使用の変数・引数は削除または`_`プレフィックスを付与

### Vue/Nuxt

- Composition API + `<script setup>` を使用
- コンポーネントはPascalCaseで命名
- propsとemitsには型定義を必須とする

### ファイル命名規則

| 種類 | 規則 | 例 |
|-----|------|-----|
| コンポーネント | PascalCase | `UserCard.vue` |
| Composables | camelCase + use接頭辞 | `useAuth.ts` |
| ストア | camelCase | `userStore.ts` |
| ユーティリティ | camelCase | `formatDate.ts` |

## ディレクトリ構造

Nuxt 4では`app/`ディレクトリにアプリケーションコードを配置します。

```
├── app/                  # アプリケーションコード
│   ├── app.vue           # ルートコンポーネント
│   ├── assets/           # 静的アセット（コンパイル対象）
│   │   └── styles/       # SCSS/CSSファイル
│   ├── components/       # 再利用可能コンポーネント
│   ├── composables/      # Composition API関数
│   ├── layouts/          # レイアウトコンポーネント
│   ├── middleware/       # ルートミドルウェア
│   ├── pages/            # ルーティングページ
│   ├── plugins/          # Nuxtプラグイン
│   ├── stores/           # Piniaストア
│   └── types/            # TypeScript型定義
├── public/               # 静的ファイル（そのまま配信）
├── nuxt.config.ts        # Nuxt設定
├── eslint.config.mjs     # ESLint設定（flat config）
└── tsconfig.json         # TypeScript設定
```

## 開発フロー

### 1. 新しいページの追加

```bash
# app/pages/ディレクトリにファイルを作成
# ファイル名がそのままルートになる
app/pages/
├── index.vue      # /
├── about.vue      # /about
└── users/
    ├── index.vue  # /users
    └── [id].vue   # /users/:id
```

### 2. コンポーネントの作成

```vue
<template>
  <div class="example-component">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped lang="scss">
.example-component {
  // スタイル
}
</style>
```

### 3. Piniaストアの使用

```typescript
// app/stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
})

// app/pages/index.vue
const counterStore = useCounterStore()
counterStore.increment()
```

### 4. Composableの作成

```typescript
// app/composables/useCounter.ts
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count: readonly(count),
    increment,
    decrement,
  }
}
```

## コミット規約

Conventional Commitsに従う：

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント変更
style: コード整形（動作に影響なし）
refactor: リファクタリング
test: テスト追加・修正
chore: ビルドプロセスやツール設定の変更
```

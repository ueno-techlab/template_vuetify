# API使用ガイド

[< README に戻る](../README.md)

このドキュメントでは、認証機能を持つAPIの使用方法について説明します。

## 概要

このアプリケーションでは、3つのComposableを使用してAPI通信を行います:

1. **`useApi()`** - トークン自動付与機能付きの汎用APIクライアント
2. **`useAuthApi()`** - 認証関連のAPI操作をまとめたComposable
3. **`useAuthToken()`** - トークンの保存・取得・削除を管理

---

## 基本的な使い方

### 1. 認証済みAPIリクエストの送信

`useApi()`を使用すると、LocalStorageに保存されているトークンが自動的にBearerトークンとして付与されます。

```typescript
<script setup lang="ts">
import type { User } from '~/types'

const { apiFetch } = useApi()

// GET リクエスト
const fetchUsers = async () => {
  try {
    const users = await apiFetch<User[]>('/users/')
    console.log('Users:', users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

// POST リクエスト
const createUser = async () => {
  try {
    const newUser = await apiFetch<User>('/users/', {
      method: 'POST',
      body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User'
      })
    })
    console.log('Created user:', newUser)
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}
</script>
```

**ポイント**:
- トークンは自動的に`Authorization: Bearer <token>`として付与される
- `Content-Type: application/json`も自動的に設定される
- ログインしていない場合はトークンなしでリクエストが送信される

### 2. 認証関連APIの使用

ログインやユーザー情報取得など、認証関連の操作には`useAuthApi()`を使用します:

```typescript
<script setup lang="ts">
const { login, getCurrentUser, getUsers, createUser } = useAuthApi()

// ログイン
const handleLogin = async () => {
  try {
    const response = await login({
      email: 'user@example.com',
      password: 'password123'
    })
    console.log('Access token:', response.accessToken)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// 現在のユーザー情報を取得
const fetchCurrentUser = async () => {
  try {
    const user = await getCurrentUser()
    console.log('Current user:', user)
  } catch (error) {
    console.error('Failed to fetch current user:', error)
  }
}

// 全ユーザーを取得
const fetchAllUsers = async () => {
  try {
    const users = await getUsers()
    console.log('All users:', users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

// 新しいユーザーを作成
const addUser = async () => {
  try {
    const newUser = await createUser({
      email: 'newuser@example.com',
      password: 'password123',
      name: 'New User'
    })
    console.log('Created user:', newUser)
  } catch (error) {
    console.error('Failed to create user:', error)
  }
}
</script>
```

### 3. トークンの直接操作

通常はAuth Storeを通じてトークンを管理しますが、必要に応じて直接操作することもできます:

```typescript
<script setup lang="ts">
const { getToken, setToken, removeToken } = useAuthToken()

// トークンを取得
const token = getToken()
console.log('Current token:', token)

// トークンを保存
setToken('new-token-value')

// トークンを削除
removeToken()
</script>
```

---

## 実践例

### ユーザー一覧ページの実装例

```vue
<template>
  <div>
    <v-card>
      <v-card-title>ユーザー一覧</v-card-title>
      <v-card-text>
        <v-list v-if="users.length > 0">
          <v-list-item
            v-for="user in users"
            :key="user.id"
          >
            <v-list-item-title>{{ user.name || user.email }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <v-progress-circular v-else-if="loading" indeterminate />
        <v-alert v-else-if="error" type="error">
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="loadUsers" :loading="loading">
          再読み込み
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '~/types'

definePageMeta({
  middleware: 'auth', // 認証が必要
})

const { apiFetch } = useApi()

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')

const loadUsers = async () => {
  try {
    loading.value = true
    error.value = ''

    users.value = await apiFetch<User[]>('/users/')
  } catch (e) {
    error.value = 'ユーザー一覧の取得に失敗しました'
    console.error('Failed to load users:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>
```

### ユーザー作成フォームの実装例

```vue
<template>
  <div>
    <v-card>
      <v-card-title>新規ユーザー作成</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid">
          <v-text-field
            v-model="email"
            label="メールアドレス"
            type="email"
            :rules="emailRules"
            required
          />
          <v-text-field
            v-model="password"
            label="パスワード"
            type="password"
            :rules="passwordRules"
            required
          />
          <v-text-field
            v-model="name"
            label="名前 (オプション)"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="handleSubmit"
          :disabled="!valid || loading"
          :loading="loading"
          color="primary"
        >
          作成
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'

definePageMeta({
  middleware: 'auth',
})

const { apiFetch } = useApi()
const appStore = useAppStore()
const router = useRouter()

const formRef = ref<VForm | null>(null)
const valid = ref(false)
const loading = ref(false)

const email = ref('')
const password = ref('')
const name = ref('')

const emailRules = [
  (v: string) => !!v || 'メールアドレスを入力してください',
  (v: string) => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません',
]

const passwordRules = [
  (v: string) => !!v || 'パスワードを入力してください',
  (v: string) => v.length >= 8 || 'パスワードは8文字以上で入力してください',
]

const handleSubmit = async () => {
  if (!formRef.value) return

  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return

  try {
    loading.value = true

    await apiFetch('/users/', {
      method: 'POST',
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        name: name.value || undefined,
      })
    })

    appStore.showNotification('ユーザーを作成しました', 'success')
    await router.push('/users')
  } catch (error) {
    appStore.showNotification('ユーザーの作成に失敗しました', 'error')
    console.error('Failed to create user:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

---

## API仕様

### エンドポイント一覧

#### 認証

**POST /auth/login**
- 説明: ユーザーログイン
- 認証: 不要
- リクエスト:
  ```json
  {
    "email": "string (email形式)",
    "password": "string (8文字以上)"
  }
  ```
- レスポンス (200):
  ```json
  {
    "accessToken": "string"
  }
  ```
- レスポンス (401):
  ```json
  {
    "error": "string"
  }
  ```

#### ユーザー

**GET /users/**
- 説明: 全ユーザー一覧を取得
- 認証: 必要 (Bearer token)
- レスポンス (200):
  ```json
  [
    {
      "id": 1,
      "email": "string",
      "name": "string | null",
      "createdAt": "string (ISO 8601形式)"
    }
  ]
  ```

**POST /users/**
- 説明: 新規ユーザーを作成
- 認証: 必要 (Bearer token)
- リクエスト:
  ```json
  {
    "email": "string (email形式)",
    "password": "string (8文字以上)",
    "name": "string (オプション)"
  }
  ```
- レスポンス (200):
  ```json
  {
    "id": 1,
    "email": "string",
    "name": "string | null",
    "createdAt": "string"
  }
  ```
- レスポンス (409):
  ```json
  {
    "error": "string"
  }
  ```

**GET /users/me**
- 説明: 現在ログイン中のユーザー情報を取得
- 認証: 必要 (Bearer token)
- レスポンス (200):
  ```json
  {
    "id": 1,
    "email": "string",
    "name": "string | null",
    "createdAt": "string"
  }
  ```

---

## エラーハンドリング

### 基本的なエラーハンドリング

```typescript
const { apiFetch } = useApi()
const appStore = useAppStore()

const fetchData = async () => {
  try {
    const data = await apiFetch('/users/')
    return data
  } catch (error: unknown) {
    // エラーメッセージの抽出
    let errorMessage = 'エラーが発生しました'

    if (error && typeof error === 'object' && 'data' in error) {
      const errorData = error.data as { error?: string }
      if (errorData.error) {
        errorMessage = errorData.error
      }
    }

    // 通知システムでエラーを表示
    appStore.showNotification(errorMessage, 'error')

    throw error // 必要に応じて再スロー
  }
}
```

### 401エラー (認証エラー) の処理

認証エラーが発生した場合、Auth Middlewareが自動的にログインページにリダイレクトします。
追加で手動でログアウト処理を行いたい場合:

```typescript
const { apiFetch } = useApi()
const authStore = useAuthStore()
const router = useRouter()

const fetchProtectedData = async () => {
  try {
    const data = await apiFetch('/users/me')
    return data
  } catch (error: unknown) {
    // 401エラーの場合はログアウト
    if (error && typeof error === 'object' && 'status' in error) {
      if (error.status === 401) {
        await authStore.logout()
        await router.push('/login')
        return
      }
    }

    throw error
  }
}
```

---

## 環境変数

API通信には以下の環境変数を使用します:

```env
# .env
NUXT_PUBLIC_API_BASE=http://localhost:3000
```

開発環境では`.env.example`をコピーして`.env`ファイルを作成してください。

---

## 型定義

すべてのAPIレスポンスは型安全です。型定義は[types/index.d.ts](../types/index.d.ts)に記載されています。

```typescript
import type { User, LoginRequest, LoginResponse } from '~/types'

// 型が自動的に推論される
const { apiFetch } = useApi()
const users = await apiFetch<User[]>('/users/')
// users は User[] 型
```

---

## まとめ

- **`useApi()`を使えば、すべてのAPI通信で認証トークンが自動付与される**
- **認証関連の操作は`useAuthApi()`を使用**
- **エラーハンドリングはtry-catchで行い、通知システムを活用**
- **すべてのAPIレスポンスは型安全**

追加のAPIエンドポイントを実装する場合も、同じパターンで`useApi()`を使用してください。

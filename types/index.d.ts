// グローバル型定義

// 環境変数の型拡張
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      NUXT_PUBLIC_API_BASE?: string
      NUXT_PUBLIC_APP_NAME?: string
    }
  }
}

// Nuxt RuntimeConfig型拡張
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    apiSecret: string
  }
  interface PublicRuntimeConfig {
    apiBase: string
    appName: string
  }
}

export {}

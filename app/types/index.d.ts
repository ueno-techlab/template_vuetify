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

// User types
export interface User {
  id: number
  email: string
  name: string | null
  createdAt: string
}

// Auth API types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
}

export interface AuthError {
  error: string
}

// Auth store state
export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export {}

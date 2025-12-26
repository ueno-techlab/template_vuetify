// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // SPAモード（SSR無効化）

  // モジュール
  modules: ['@pinia/nuxt', 'vuetify-nuxt-module', '@nuxt/eslint'],
  ssr: false,

  // アプリ設定
  app: {
    head: {
      title: 'Template Vuetify',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Vue3 + Nuxt4 + Vuetify Template' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  // ランタイム設定
  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: '',
      appName: 'Template Vuetify',
    },
  },

  // 開発サーバー設定
  devServer: {
    host: '0.0.0.0',
    port: 4000,
  },

  // 互換性日付
  compatibilityDate: '2025-01-01',

  // Vite設定
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // @ts-expect-error Vite 6のSCSS API設定
          api: 'modern-compiler',
        },
      },
    },
  },

  // TypeScript設定
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // ESLint設定
  eslint: {
    config: {
      stylistic: true,
    },
  },

  // Pinia設定
  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  // Vuetify設定
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            dark: false,
            colors: {
              primary: '#1976D2',
              secondary: '#424242',
              accent: '#82B1FF',
              error: '#FF5252',
              info: '#2196F3',
              success: '#4CAF50',
              warning: '#FB8C00',
            },
          },
        },
      },
      defaults: {
        VBtn: {
          variant: 'flat',
        },
        VTextField: {
          variant: 'outlined',
          density: 'comfortable',
        },
      },
    },
  },
})

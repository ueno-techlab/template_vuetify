// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // SPAモード（SSR無効化）
  ssr: false,

  // 開発ツール
  devtools: { enabled: true },

  // モジュール
  modules: [
    [
      '@pinia/nuxt',
      {
        storesDirs: ['./stores/**'],
      },
    ],
    [
      'vuetify-nuxt-module',
      {
        // treeshaking有効化
        treeshaking: true,
        // スタイル設定
        styles: {
          configFile: 'assets/styles/vuetify-settings.scss',
        },
        // Vuetifyオプション
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
    ],
  ],

  // TypeScript設定
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // ランタイム設定
  runtimeConfig: {
    // サーバーサイドのみ（SPAでは使用しない）
    apiSecret: '',
    // クライアントサイドに公開
    public: {
      apiBase: '',
      appName: 'Template Vuetify',
    },
  },

  // アプリ設定
  app: {
    head: {
      title: 'Template Vuetify',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Vue3 + Nuxt3 + Vuetify Template' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  // Vite設定
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },

  // 開発サーバー設定
  devServer: {
    host: '0.0.0.0',
    port: 4000,
  },

  // 互換性日付
  compatibilityDate: '2024-12-01',
})

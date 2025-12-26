// Vuetifyの追加設定用プラグイン
// vuetify-nuxt-moduleが自動設定するため、基本的な設定は不要
// アイコンやカスタムコンポーネントの追加が必要な場合に使用

import { defineNuxtPlugin } from '#app'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin(() => {
  // 追加の初期化処理があれば記述
})

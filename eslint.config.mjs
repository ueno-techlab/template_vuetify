// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import prettierRecommended from 'eslint-plugin-prettier/recommended'

export default withNuxt(prettierRecommended, {
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    // Vue
    'vue/multi-word-component-names': 'off',
    // Vuetifyのv-data-tableで #item.xxx の形式を使用するため
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
  },
})

<template>
  <v-row justify="center" align="center" class="fill-height">
    <v-col cols="12" sm="8" md="6" lg="4">
      <v-card elevation="8">
        <v-card-title class="text-h5 text-center py-6 bg-primary">
          ログイン
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="formRef" v-model="valid" @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="メールアドレス"
              type="email"
              :rules="emailRules"
              :disabled="loading"
              autofocus
              required
            />

            <v-text-field
              v-model="password"
              label="パスワード"
              :type="showPassword ? 'text' : 'password'"
              :rules="passwordRules"
              :disabled="loading"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              required
            />

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mb-4"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              :loading="loading"
              :disabled="!valid || loading"
              block
            >
              ログイン
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useAuthStore } from '~/stores/auth'
import { definePageMeta, useRoute, useRouter } from '#imports'

definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const formRef = ref<VForm | null>(null)
const valid = ref(false)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

// Validation rules matching OpenAPI spec
const emailRules = [
  (v: string) => !!v || 'メールアドレスを入力してください',
  (v: string) => /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません',
]

const passwordRules = [
  (v: string) => !!v || 'パスワードを入力してください',
  (v: string) => v.length >= 8 || 'パスワードは8文字以上で入力してください',
]

const handleLogin = async () => {
  if (!formRef.value) return

  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return

  try {
    loading.value = true
    errorMessage.value = ''

    await authStore.login(email.value, password.value)

    const redirectPath = (route.query.redirect as string) || '/'
    await router.push(redirectPath)
  } catch (error: unknown) {
    errorMessage.value = 'メールアドレスまたはパスワードが正しくありません'
  } finally {
    loading.value = false
  }
}
</script>

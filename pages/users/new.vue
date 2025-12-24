<template>
  <div>
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="py-4">
            <v-btn icon="mdi-arrow-left" variant="text" :to="'/users'" />
            <span class="text-h5 ml-2">新規ユーザー作成</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="メールアドレス"
                type="email"
                :rules="emailRules"
                :disabled="loading"
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

              <v-text-field
                v-model="name"
                label="名前（オプション）"
                :disabled="loading"
              />

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="error = ''"
              >
                {{ error }}
              </v-alert>

              <div class="d-flex justify-end gap-2 mt-4">
                <v-btn variant="text" :to="'/users'" :disabled="loading">
                  キャンセル
                </v-btn>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="!valid || loading"
                >
                  作成
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useAuthApi } from '~/composables/useAuthApi'
import { definePageMeta, useRouter } from '#imports'

definePageMeta({
  middleware: 'auth',
})

const router = useRouter()
const { createUser } = useAuthApi()

const formRef = ref<VForm | null>(null)
const valid = ref(false)
const loading = ref(false)
const error = ref('')

const email = ref('')
const password = ref('')
const name = ref('')
const showPassword = ref(false)

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
    error.value = ''

    const userData: { email: string; password: string; name?: string } = {
      email: email.value,
      password: password.value,
    }
    if (name.value) {
      userData.name = name.value
    }

    await createUser(userData)

    await router.push('/users')
  } catch (e) {
    error.value = 'ユーザーの作成に失敗しました。メールアドレスが既に使用されている可能性があります。'
    console.error('Failed to create user:', e)
  } finally {
    loading.value = false
  }
}
</script>

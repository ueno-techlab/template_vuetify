<template>
  <div>
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="py-4">
            <v-btn icon="mdi-arrow-left" variant="text" :to="'/users'" />
            <span class="text-h5 ml-2">ユーザー編集</span>
          </v-card-title>

          <v-card-text>
            <v-progress-circular
              v-if="initialLoading"
              indeterminate
              class="d-block mx-auto my-8"
            />

            <v-alert
              v-else-if="loadError"
              type="error"
              variant="tonal"
              class="mb-4"
            >
              {{ loadError }}
              <template #append>
                <v-btn variant="text" :to="'/users'">一覧に戻る</v-btn>
              </template>
            </v-alert>

            <v-form
              v-else
              ref="formRef"
              v-model="valid"
              @submit.prevent="handleSubmit"
            >
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
                label="新しいパスワード（変更する場合のみ入力）"
                :type="showPassword ? 'text' : 'password'"
                :rules="passwordRules"
                :disabled="loading"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
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
                  更新
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
import { ref, onMounted } from 'vue'
import type { VForm } from 'vuetify/components'
import { useAuthApi } from '~/composables/useAuthApi'
import { definePageMeta, useRoute, useRouter } from '#imports'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const router = useRouter()
const { getUser, updateUser } = useAuthApi()

const formRef = ref<VForm | null>(null)
const valid = ref(false)
const loading = ref(false)
const initialLoading = ref(true)
const error = ref('')
const loadError = ref('')

const email = ref('')
const password = ref('')
const name = ref('')
const showPassword = ref(false)

const userId = Number(route.params.id)

const emailRules = [
  (v: string) => !!v || 'メールアドレスを入力してください',
  (v: string) =>
    /.+@.+\..+/.test(v) || 'メールアドレスの形式が正しくありません',
]

const passwordRules = [
  (v: string) =>
    !v || v.length >= 8 || 'パスワードは8文字以上で入力してください',
]

const loadUser = async () => {
  try {
    initialLoading.value = true
    loadError.value = ''

    const user = await getUser(userId)
    email.value = user.email
    name.value = user.name || ''
  } catch (e) {
    loadError.value = 'ユーザー情報の取得に失敗しました'
    console.error('Failed to load user:', e)
  } finally {
    initialLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const { valid: isValid } = await formRef.value.validate()
  if (!isValid) return

  try {
    loading.value = true
    error.value = ''

    const updateData: { email?: string; password?: string; name?: string } = {}

    if (email.value) {
      updateData.email = email.value
    }
    if (password.value) {
      updateData.password = password.value
    }
    if (name.value) {
      updateData.name = name.value
    }

    await updateUser(userId, updateData)
    await router.push('/users')
  } catch (e) {
    error.value =
      'ユーザーの更新に失敗しました。メールアドレスが既に使用されている可能性があります。'
    console.error('Failed to update user:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUser()
})
</script>

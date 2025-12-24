<template>
  <div>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="10" lg="8">
        <v-card>
          <v-card-title class="text-h4 py-6"> ダッシュボード </v-card-title>
          <v-card-text>
            <p class="text-body-1 mb-4">
              ようこそ、{{ user?.name || user?.email }}さん！
            </p>
            <v-divider class="my-4" />
            <div class="text-body-2">
              <p><strong>メールアドレス:</strong> {{ user?.email }}</p>
              <p><strong>ユーザーID:</strong> {{ user?.id }}</p>
              <p><strong>アカウント作成日:</strong> {{ formattedDate }}</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const formattedDate = computed(() => {
  if (!user.value?.createdAt) return 'N/A'
  return new Date(user.value.createdAt).toLocaleDateString('ja-JP')
})
</script>

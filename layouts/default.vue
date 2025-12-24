<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>
        {{ appName }}
      </v-app-bar-title>

      <v-spacer />

      <template v-if="isAuthenticated">
        <v-btn :to="'/dashboard'" variant="text">
          ダッシュボード
        </v-btn>

        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text">
              <v-icon start>mdi-account-circle</v-icon>
              {{ userName }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="handleLogout">
              <template #prepend>
                <v-icon>mdi-logout</v-icon>
              </template>
              <v-list-item-title>ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn :to="'/login'" variant="text">
          ログイン
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <v-footer app class="text-center d-flex flex-column">
      <div class="text-body-2">&copy; {{ currentYear }} {{ appName }}</div>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRuntimeConfig, useRouter } from '#imports'
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const appName = config.public.appName
const authStore = useAuthStore()
const router = useRouter()

const currentYear = computed(() => new Date().getFullYear())
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(
  () => authStore.user?.name || authStore.user?.email || 'ユーザー'
)

const handleLogout = async () => {
  await authStore.logout()
  await router.push('/login')
}
</script>

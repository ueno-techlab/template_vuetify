<template>
  <v-app>
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-title>
        {{ appName }}
      </v-app-bar-title>
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
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const appName = config.public.appName

const currentYear = computed(() => new Date().getFullYear())
</script>

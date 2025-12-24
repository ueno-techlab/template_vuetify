<template>
  <div>
    <v-row justify="center" class="mt-8">
      <v-col cols="12" md="8" lg="6">
        <v-card>
          <v-card-title class="text-h4 text-center py-6">
            Welcome to {{ appName }}
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-body-1 mb-4">
              Vue3 + Nuxt3 + TypeScript + Vuetify テンプレート
            </p>
            <v-chip color="primary" class="ma-1">Vue 3</v-chip>
            <v-chip color="secondary" class="ma-1">Nuxt 3</v-chip>
            <v-chip color="accent" class="ma-1">TypeScript</v-chip>
            <v-chip color="info" class="ma-1">Vuetify 3</v-chip>
            <v-chip color="success" class="ma-1">Pinia</v-chip>
          </v-card-text>
          <v-card-actions class="justify-center pb-6">
            <v-btn
              color="primary"
              size="large"
              href="https://nuxt.com/docs"
              target="_blank"
            >
              Nuxt Docs
            </v-btn>
            <v-btn
              color="secondary"
              size="large"
              href="https://vuetifyjs.com"
              target="_blank"
            >
              Vuetify Docs
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()
const appName = config.public.appName
</script>

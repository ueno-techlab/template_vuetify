<template>
  <div>
    <v-row justify="center" class="mt-4">
      <v-col cols="12" md="10" lg="8">
        <v-card>
          <v-card-title class="d-flex align-center py-4">
            <span class="text-h5">ユーザー管理</span>
            <v-spacer />
            <v-btn color="primary" :to="'/users/new'">
              <v-icon start>mdi-plus</v-icon>
              新規ユーザー
            </v-btn>
          </v-card-title>

          <v-card-text>
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

            <v-data-table
              :headers="headers"
              :items="users"
              :loading="loading"
              class="elevation-1"
            >
              <template #item.name="{ item }">
                {{ item.name || '-' }}
              </template>

              <template #item.createdAt="{ item }">
                {{ formatDate(item.createdAt) }}
              </template>

              <template #item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="primary"
                  :to="`/users/${item.id}`"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="error"
                  @click="confirmDelete(item)"
                />
              </template>

              <template #loading>
                <v-skeleton-loader type="table-row@5" />
              </template>

              <template #no-data>
                <div class="text-center py-4">
                  <p class="text-body-1 mb-2">ユーザーが登録されていません</p>
                  <v-btn color="primary" :to="'/users/new'">
                    最初のユーザーを作成
                  </v-btn>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 削除確認ダイアログ -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>ユーザーの削除</v-card-title>
        <v-card-text>
          <p>
            以下のユーザーを削除しますか？この操作は取り消せません。
          </p>
          <p class="mt-2 font-weight-bold">
            {{ userToDelete?.name || userToDelete?.email }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">
            キャンセル
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="deleting"
            @click="handleDelete"
          >
            削除
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '~/types'
import { useAuthApi } from '~/composables/useAuthApi'
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'auth',
})

const { getUsers, deleteUser } = useAuthApi()

const users = ref<User[]>([])
const loading = ref(false)
const error = ref('')
const deleteDialog = ref(false)
const userToDelete = ref<User | null>(null)
const deleting = ref(false)

const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'メールアドレス', key: 'email' },
  { title: '名前', key: 'name' },
  { title: '作成日', key: 'createdAt', width: '120px' },
  { title: '操作', key: 'actions', sortable: false, width: '120px' },
]

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ja-JP')
}

const loadUsers = async () => {
  try {
    loading.value = true
    error.value = ''
    users.value = await getUsers()
  } catch (e) {
    error.value = 'ユーザー一覧の取得に失敗しました'
    console.error('Failed to load users:', e)
  } finally {
    loading.value = false
  }
}

const confirmDelete = (user: User) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!userToDelete.value) return

  try {
    deleting.value = true
    await deleteUser(userToDelete.value.id)
    users.value = users.value.filter((u) => u.id !== userToDelete.value?.id)
    deleteDialog.value = false
    userToDelete.value = null
  } catch (e) {
    error.value = 'ユーザーの削除に失敗しました'
    console.error('Failed to delete user:', e)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

import { defineStore } from 'pinia'
import type { User, AuthState } from '~/types'
import { useAppStore } from '~/stores/app'
import { useAuthApi } from '~/composables/useAuthApi'
import { useAuthToken } from '~/composables/useAuthToken'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state): User | null => state.user,
    getToken: (state): string | null => state.token,
    getIsAuthenticated: (state): boolean => state.isAuthenticated,
  },

  actions: {
    async login(email: string, password: string): Promise<void> {
      const { login, getCurrentUser } = useAuthApi()
      const { setToken } = useAuthToken()
      const appStore = useAppStore()

      try {
        appStore.setLoading(true)

        // Call login API
        const response = await login({ email, password })

        // Store token
        this.token = response.accessToken
        setToken(response.accessToken)

        // Fetch user data
        const user = await getCurrentUser()
        this.user = user
        this.isAuthenticated = true

        appStore.showNotification('ログインしました', 'success')
      } catch (error: unknown) {
        let errorMessage = 'ログインに失敗しました'

        if (error && typeof error === 'object' && 'data' in error) {
          const errorData = error.data as { error?: string }
          if (errorData.error) {
            errorMessage = errorData.error
          }
        }

        appStore.showNotification(errorMessage, 'error')
        throw error
      } finally {
        appStore.setLoading(false)
      }
    },

    async logout(): Promise<void> {
      const { removeToken } = useAuthToken()
      const appStore = useAppStore()

      removeToken()
      this.token = null
      this.user = null
      this.isAuthenticated = false

      appStore.showNotification('ログアウトしました', 'info')
    },

    async initializeAuth(): Promise<void> {
      const { getToken } = useAuthToken()
      const { getCurrentUser } = useAuthApi()

      const token = getToken()
      if (!token) {
        return
      }

      try {
        this.token = token
        const user = await getCurrentUser()
        this.user = user
        this.isAuthenticated = true
      } catch (error) {
        console.error('Token validation failed:', error)
        await this.logout()
      }
    },

    async fetchCurrentUser(): Promise<void> {
      const { getCurrentUser } = useAuthApi()

      try {
        const user = await getCurrentUser()
        this.user = user
      } catch (error) {
        console.error('Failed to fetch user:', error)
        throw error
      }
    },
  },
})

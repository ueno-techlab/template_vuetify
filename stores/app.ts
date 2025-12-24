import { defineStore } from 'pinia'

interface AppState {
  isLoading: boolean
  notification: {
    show: boolean
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    isLoading: false,
    notification: {
      show: false,
      message: '',
      type: 'info',
    },
  }),

  getters: {
    getIsLoading: (state): boolean => state.isLoading,
    getNotification: (state): AppState['notification'] => state.notification,
  },

  actions: {
    setLoading(value: boolean): void {
      this.isLoading = value
    },

    showNotification(
      message: string,
      type: AppState['notification']['type'] = 'info'
    ): void {
      this.notification = {
        show: true,
        message,
        type,
      }
    },

    hideNotification(): void {
      this.notification.show = false
    },
  },
})

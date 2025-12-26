const AUTH_TOKEN_KEY = 'auth_token'

export const useAuthToken = () => {
  const getToken = (): string | null => {
    if (import.meta.client) {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }
    return null
  }

  const setToken = (token: string): void => {
    if (import.meta.client) {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    }
  }

  const removeToken = (): void => {
    if (import.meta.client) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
  }

  return {
    getToken,
    setToken,
    removeToken,
  }
}

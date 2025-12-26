import { useRuntimeConfig } from '#imports'
import { useAuthToken } from './useAuthToken'

type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'

export interface ApiFetchOptions<TBody = Record<string, unknown>> {
  method?: HttpMethod
  body?: TBody
  headers?: Record<string, string>
  query?: Record<string, unknown>
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const { getToken } = useAuthToken()

  /**
   * トークンを自動的に付与するAPI呼び出しヘルパー
   * 全てのAPI通信でこれを使用することで、認証トークンが自動的に含まれる
   */
  const apiFetch = async <T, TBody = Record<string, unknown>>(
    endpoint: string,
    options: ApiFetchOptions<TBody> = {}
  ): Promise<T> => {
    const token = getToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // トークンが存在する場合は自動的にBearerトークンを付与
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // $fetchのオプションを構築（undefinedを除外）
    const fetchOptions: Parameters<typeof $fetch>[1] = { headers }

    if (options.method !== undefined) {
      fetchOptions.method = options.method
    }
    if (options.body !== undefined) {
      fetchOptions.body = options.body as Record<string, unknown>
    }
    if (options.query !== undefined) {
      fetchOptions.query = options.query
    }

    const response = await $fetch<T>(`${apiBase}${endpoint}`, fetchOptions)

    return response
  }

  return {
    apiFetch,
  }
}

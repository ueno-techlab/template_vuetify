import type { LoginRequest, LoginResponse, User } from '~/types'
import { useApi } from './useApi'

interface UpdateUserData {
  email?: string
  password?: string
  name?: string
}

export const useAuthApi = () => {
  const { apiFetch } = useApi()

  // Login API call
  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    return apiFetch<LoginResponse, LoginRequest>('/auth/login', {
      method: 'POST',
      body: credentials,
    })
  }

  // Get current user
  const getCurrentUser = async (): Promise<User> => {
    return apiFetch<User>('/users/me')
  }

  // Get all users
  const getUsers = async (): Promise<User[]> => {
    return apiFetch<User[]>('/users/')
  }

  // Get user by ID
  const getUser = async (id: number): Promise<User> => {
    return apiFetch<User>(`/users/${id}`)
  }

  // Create user
  const createUser = async (userData: {
    email: string
    password: string
    name?: string
  }): Promise<User> => {
    return apiFetch<User, typeof userData>('/users/', {
      method: 'POST',
      body: userData,
    })
  }

  // Update user
  const updateUser = async (
    id: number,
    userData: UpdateUserData
  ): Promise<User> => {
    return apiFetch<User, UpdateUserData>(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    })
  }

  // Delete user
  const deleteUser = async (id: number): Promise<void> => {
    await apiFetch(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    login,
    getCurrentUser,
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
  }
}

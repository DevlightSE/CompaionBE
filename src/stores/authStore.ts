import Cookies from 'js-cookie'
import { create } from 'zustand'
import { api } from '@/config/api'

const ACCESS_TOKEN = 'thisisjustarandomstring'

export interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface LoginCredentials {
  email?: string
  password?: string
  provider?: 'google' | 'microsoft'
  token?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    login: (credentials: LoginCredentials) => Promise<void>
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
      login: async (credentials) => {
        try {
          let response;
          if (credentials.provider) {
            // Social login
            response = await api.post('/auth/social-login', {
              provider: credentials.provider,
              token: credentials.token
            });
          } else {
            // Regular email/password login
            response = await api.post('/auth/login', {
              email: credentials.email,
              password: credentials.password
            });
          }
          
          const { accessToken, user } = response.data;
          set((state) => ({
            ...state,
            auth: {
              ...state.auth,
              accessToken,
              user
            }
          }));
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
    },
  }
})

export const useAuth = () => useAuthStore((state) => state.auth)

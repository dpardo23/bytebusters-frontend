import { useEffect, useMemo, useState } from 'react'
import { login, logout, registerAccount } from '../../services/auth/authService'
import type { AuthCredentials, AuthResult, AuthState, RegisterAccountData } from '../../types/auth.types'
import {
  clearAuthenticatedUser,
  getAuthState,
  initializeAuthState,
  markRegisteredUser,
  setAuthenticatedUser,
} from '../../store/auth/authStore'

interface AuthActions {
  login(credentials: AuthCredentials): Promise<AuthResult>
  register(data: RegisterAccountData): Promise<AuthResult>
  logout(): Promise<void>
}

export function useAuth(): AuthState & AuthActions {
  const [authSnapshot, setAuthSnapshot] = useState<AuthState>(() => ({ ...getAuthState() }))

  useEffect(() => {
    initializeAuthState()
    setAuthSnapshot({ ...getAuthState() })
  }, [])

  const actions = useMemo<AuthActions>(
    () => ({
      async login(credentials) {
        const result = await login(credentials)
        if (result.success) {
          setAuthenticatedUser(result.user, result.token ?? null)
          setAuthSnapshot({ ...getAuthState() })
        }
        return result
      },
      async register(data) {
        const result = await registerAccount(data)
        if (result.success) {
          markRegisteredUser()
          setAuthenticatedUser(result.user)
          setAuthSnapshot({ ...getAuthState() })
        }
        return result
      },
      async logout() {
        await logout()
        clearAuthenticatedUser()
        setAuthSnapshot({ ...getAuthState() })
      },
    }),
    [],
  )

  return {
    ...authSnapshot,
    ...actions,
  }
}

export default useAuth

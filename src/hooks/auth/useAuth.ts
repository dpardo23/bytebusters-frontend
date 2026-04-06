import { useEffect, useMemo, useState } from 'react'
import { login, logout, registerAccount } from '../../services/auth/authService'
import type { AuthCredentials, AuthResult, AuthRole, AuthState, RegisterAccountData } from '../../types/auth.types'
import {
  clearAuthenticatedUser,
  getAuthState,
  initializeAuthState,
  markRegisteredUser,
  setAuthenticatedUser,
  updateAuthenticatedUser,
} from '../../store/auth/authStore'

interface AuthActions {
  login(credentials: AuthCredentials): Promise<AuthResult>
  register(data: RegisterAccountData): Promise<AuthResult>
  updateRole(role: Extract<AuthRole, 'basic' | 'professional' | 'recruiter'>): void
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
          setAuthenticatedUser(result.user)
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
      updateRole(role) {
        updateAuthenticatedUser({ role })
        setAuthSnapshot({ ...getAuthState() })
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
import { useEffect, useMemo, useState } from 'react'
import { login, logout, registerAccount, selectUserType } from '../../services/auth/authService'
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
  selectAccountRole(role: Extract<AuthRole, 'professional' | 'recruiter'>): Promise<AuthResult>
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
        if (result.success && result.user) {
          markRegisteredUser()
          setAuthenticatedUser(result.user, result.token || null)
          setAuthSnapshot({ ...getAuthState() })
        }
        return result
      },
      async register(data) {
        const result = await registerAccount(data)
        if (result.success && result.user) {
          markRegisteredUser()
          setAuthenticatedUser(result.user, result.token || null)
          setAuthSnapshot({ ...getAuthState() })
        }
        return result
      },
      updateRole(role) {
        updateAuthenticatedUser({ role })
        setAuthSnapshot({ ...getAuthState() })
      },
      async selectAccountRole(role) {
        const targetUserType = role === 'recruiter' ? 'RECLUTADOR' : 'ESTANDAR'
        const result = await selectUserType(targetUserType)
        if (result.success && result.user) {
          // Backend stores ESTANDAR/RECLUTADOR; frontend distinguishes professional locally.
          const nextUser = {
            ...result.user,
            role,
          }

          setAuthenticatedUser(nextUser, result.token || null)
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

import { useEffect, useMemo, useState } from 'react'
import { login, logout, registerAccount } from '../../services/auth/authService'
import {
  clearAuthenticatedUser,
  getAuthState,
  initializeAuthState,
  setAuthenticatedUser,
} from '../../store/auth/authStore'

export function useAuth() {
  const [authSnapshot, setAuthSnapshot] = useState(() => getAuthState())

  useEffect(() => {
    initializeAuthState()
    setAuthSnapshot({ ...getAuthState() })
  }, [])

  const actions = useMemo(
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
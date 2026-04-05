import type { AuthState, AuthUser } from '../../types/auth.types'

const authState: AuthState = {
  user: null,
  token: null,
}

const STORAGE_KEY = 'devfolio-user'
const REGISTERED_KEY = 'devfolio-has-registered'

export function getAuthState(): AuthState {
  return authState
}

export function setAuthState(nextState: Partial<AuthState>): void {
  Object.assign(authState, nextState)
}

export function initializeAuthState(): void {
  try {
    const hasRegistered = localStorage.getItem(REGISTERED_KEY) === '1'
    if (!hasRegistered) {
      localStorage.removeItem(STORAGE_KEY)
      authState.user = null
      return
    }

    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      authState.user = JSON.parse(storedUser) as AuthUser
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    authState.user = null
  }
}

export function setAuthenticatedUser(user: AuthUser): void {
  authState.user = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function markRegisteredUser(): void {
  localStorage.setItem(REGISTERED_KEY, '1')
}

export function clearAuthenticatedUser(): void {
  authState.user = null
  authState.token = null
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(REGISTERED_KEY)
}
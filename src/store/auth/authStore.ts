import type { AuthState, AuthUser } from '../../types/auth.types'

const authState: AuthState = {
  user: null,
  token: null,
}

const STORAGE_KEY = 'devfolio-user'
export const AUTH_TOKEN_STORAGE_KEY = 'devfolio-token'
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
    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

    if (storedUser) {
      authState.user = JSON.parse(storedUser) as AuthUser
    }

    authState.token = storedToken || null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    authState.user = null
    authState.token = null
  }
}

export function setAuthenticatedUser(user: AuthUser, token?: string | null): void {
  authState.user = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

  if (token) {
    authState.token = token
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  }
}

export function updateAuthenticatedUser(nextUserData: Partial<AuthUser>): AuthUser | null {
  if (!authState.user) {
    return null
  }

  authState.user = {
    ...authState.user,
    ...nextUserData,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(authState.user))
  return authState.user
}

export function markRegisteredUser(): void {
  localStorage.setItem(REGISTERED_KEY, '1')
}

export function clearAuthenticatedUser(): void {
  authState.user = null
  authState.token = null
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  localStorage.removeItem(REGISTERED_KEY)
}
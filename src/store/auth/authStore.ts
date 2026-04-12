import type { AuthState, AuthUser } from '../../types/auth.types'

const authState: AuthState = {
  user: null,
  token: null,
}

type AuthStateListener = (nextState: AuthState) => void
const authStateListeners = new Set<AuthStateListener>()

const STORAGE_KEY = 'ethoshub-user'
export const AUTH_TOKEN_STORAGE_KEY = 'ethoshub-token'
const REGISTERED_KEY = 'ethoshub-has-registered'

export function getAuthState(): AuthState {
  return authState
}

function emitAuthState(): void {
  authStateListeners.forEach((listener) => listener(authState))
}

export function subscribeAuthState(listener: AuthStateListener): () => void {
  authStateListeners.add(listener)
  return () => {
    authStateListeners.delete(listener)
  }
}

export function setAuthState(nextState: Partial<AuthState>): void {
  Object.assign(authState, nextState)
  emitAuthState()
}

export function initializeAuthState(): void {
  try {
    const hasRegistered = localStorage.getItem(REGISTERED_KEY) === '1'
    if (!hasRegistered) {
      localStorage.removeItem(STORAGE_KEY)
      authState.user = null
      authState.token = null
      emitAuthState()
      return
    }

    const storedUser = localStorage.getItem(STORAGE_KEY)
    const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)

    if (storedUser) {
      authState.user = JSON.parse(storedUser) as AuthUser
    }

    authState.token = storedToken || null
    emitAuthState()
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    authState.user = null
    authState.token = null
    emitAuthState()
  }
}

export function setAuthenticatedUser(user: AuthUser, token?: string | null): void {
  authState.user = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

  if (token) {
    authState.token = token
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
  }

  emitAuthState()
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
  emitAuthState()
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
  emitAuthState()
}
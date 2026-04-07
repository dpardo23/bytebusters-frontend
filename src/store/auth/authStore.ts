import type { AuthState, AuthUser } from '../../types/auth.types'

const authState: AuthState = {
  user: null,
  token: null,
}

const STORAGE_KEY = 'devfolio-auth'
const REGISTERED_KEY = 'devfolio-has-registered'

function persistAuthState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: authState.user,
      token: authState.token,
    }),
  )
}

export function getAuthState(): AuthState {
  return authState
}

export function setAuthState(nextState: Partial<AuthState>): void {
  Object.assign(authState, nextState)
  persistAuthState()
}

export function initializeAuthState(): void {
  try {
    const storedSession = localStorage.getItem(STORAGE_KEY)
    if (!storedSession) {
      authState.user = null
      authState.token = null
      return
    }

    const parsedSession = JSON.parse(storedSession) as Partial<AuthState> | AuthUser

    if ('user' in parsedSession || 'token' in parsedSession) {
      authState.user = parsedSession.user ?? null
      authState.token = parsedSession.token ?? null
      return
    }

    authState.user = parsedSession as AuthUser
    authState.token = null
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    authState.user = null
    authState.token = null
  }
}

export function setAuthenticatedUser(user: AuthUser, token: string | null = null): void {
  authState.user = user
  authState.token = token
  persistAuthState()
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

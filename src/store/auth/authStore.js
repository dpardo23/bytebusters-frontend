const authState = {
  user: null,
  token: null,
}

const STORAGE_KEY = 'devfolio-user'

export function getAuthState() {
  return authState
}

export function setAuthState(nextState) {
  Object.assign(authState, nextState)
}

export function initializeAuthState() {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      authState.user = JSON.parse(storedUser)
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    authState.user = null
  }
}

export function setAuthenticatedUser(user) {
  authState.user = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearAuthenticatedUser() {
  authState.user = null
  authState.token = null
  localStorage.removeItem(STORAGE_KEY)
}
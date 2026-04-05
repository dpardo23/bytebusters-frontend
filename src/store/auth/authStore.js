const authState = {
  user: null,
  token: null,
}

const STORAGE_KEY = 'devfolio-user'
const REGISTERED_KEY = 'devfolio-has-registered'

export function getAuthState() {
  return authState
}

export function setAuthState(nextState) {
  Object.assign(authState, nextState)
}

export function initializeAuthState() {
  try {
    const hasRegistered = localStorage.getItem(REGISTERED_KEY) === '1'
    if (!hasRegistered) {
      localStorage.removeItem(STORAGE_KEY)
      authState.user = null
      return
    }

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

export function markRegisteredUser() {
  localStorage.setItem(REGISTERED_KEY, '1')
}

export function clearAuthenticatedUser() {
  authState.user = null
  authState.token = null
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(REGISTERED_KEY)
}
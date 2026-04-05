const authState = {
  user: null,
  token: null,
}

export function getAuthState() {
  return authState
}

export function setAuthState(nextState) {
  Object.assign(authState, nextState)
}
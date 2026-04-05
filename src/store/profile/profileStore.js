const profileState = {
  profile: null,
}

export function getProfileState() {
  return profileState
}

export function setProfileState(nextState) {
  Object.assign(profileState, nextState)
}
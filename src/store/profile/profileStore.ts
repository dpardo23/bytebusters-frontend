import type { ProfileState } from '../../types/profile.types'

const profileState: ProfileState = {
  profile: null,
}

export function getProfileState(): ProfileState {
  return profileState
}

export function setProfileState(nextState: Partial<ProfileState>): void {
  Object.assign(profileState, nextState)
}
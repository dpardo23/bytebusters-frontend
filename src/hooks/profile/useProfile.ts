import { getProfileState } from '../../store/profile/profileStore'
import type { ProfileState } from '../../types/profile.types'

export function useProfile(): ProfileState {
  return getProfileState()
}

export default useProfile
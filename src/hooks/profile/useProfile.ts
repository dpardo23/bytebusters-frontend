import { getProfileState } from '../../store/profile/profileStore'

export function useProfile() {
  return getProfileState()
}

export default useProfile
import { getAuthState } from '../../store/auth/authStore'

export function useAuth() {
  return getAuthState()
}

export default useAuth
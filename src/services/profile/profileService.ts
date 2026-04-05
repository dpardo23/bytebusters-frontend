import type { Profile } from '../../types/profile.types'

export async function fetchProfile(userId: string): Promise<Profile> {
  return {
    id: userId,
    name: 'Usuario',
  }
}
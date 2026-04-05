export const PROFILE_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const

export type ProfileVisibility = (typeof PROFILE_VISIBILITY)[keyof typeof PROFILE_VISIBILITY]

export interface Profile {
  id: string
  name: string
}

export interface ProfileState {
  profile: Profile | null
}
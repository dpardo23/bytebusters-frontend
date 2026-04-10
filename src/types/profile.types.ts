/*export const PROFILE_VISIBILITY = {
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
*/

export interface ExtendedUserData {
  id?: string | number;
  name: string;
  headline?: string;
  status?: string;
  statusMessage?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  photoBase64?: string;
}

export type Section = 'basic' | 'public' | 'experience' | 'education';
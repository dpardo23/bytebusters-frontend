import type { Profile } from '../../types/profile.types'
import { AUTH_TOKEN_STORAGE_KEY, getAuthState } from '../../store/auth/authStore'

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const RECRUITER_PROFILE_STORAGE_KEY = 'ethoshub-mock-recruiter-profiles'

type BackendApiResponse<T> = {
  success?: boolean
  status?: number
  message?: string
  data?: T
  errors?: string[]
}

export type RecruiterSocialLink = {
  sociallinksId?: number
  plataformId?: number | string
  platformId?: number | string
  url: string
}

export type RecruiterProfile = {
  userId: number
  profileId: number
  email: string
  userType: string
  photoBase64?: string
  basicInfo: {
    fullName: string
    firstName: string
    lastName: string
    professionalTitle: string
    countryId: string
  }
  companyInfo: {
    companyName: string
    industry: string
    companySize: number
    websiteUrl: string
    nit?: number
    contactFirstName: string
    contactLastName: string
  }
  socialLinks: RecruiterSocialLink[]
  academicRecords: unknown[]
  workExperiences: unknown[]
}

export type CompleteRecruiterProfilePayload = {
  firstName: string
  lastName: string
  professionalTitle: string
  countryId: string
  companyName: string
  industry: string
  companySize: number
  websiteUrl: string
  nit?: number
  contactFirstName: string
  contactLastName: string
  socialLinks: Array<{
    platformId: number
    url: string
  }>
  academicRecords: unknown[]
  workExperiences: unknown[]
}

function getCurrentRecruiterStorageKey(): string {
  const authUser = getAuthState().user
  if (!authUser) {
    return 'anonymous'
  }

  return authUser.id || authUser.email || 'anonymous'
}

function readStoredRecruiterProfiles(): Record<string, RecruiterProfile> {
  try {
    const raw = localStorage.getItem(RECRUITER_PROFILE_STORAGE_KEY)
    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return {}
    }

    return parsed as Record<string, RecruiterProfile>
  } catch {
    return {}
  }
}

function writeStoredRecruiterProfiles(nextProfiles: Record<string, RecruiterProfile>): void {
  localStorage.setItem(RECRUITER_PROFILE_STORAGE_KEY, JSON.stringify(nextProfiles))
}

function buildDefaultRecruiterProfile(): RecruiterProfile {
  const authUser = getAuthState().user
  const fullName = authUser?.name || 'Reclutador'
  const nameParts = fullName.trim().split(/\s+/)
  const firstName = nameParts[0] || 'Reclutador'
  const lastName = nameParts.slice(1).join(' ')
  const userId = Number(authUser?.id) || 1

  return {
    userId,
    profileId: userId,
    email: authUser?.email || 'reclutador@ethoshub.local',
    userType: 'RECLUTADOR',
    photoBase64: '',
    basicInfo: {
      fullName,
      firstName,
      lastName,
      professionalTitle: '',
      countryId: '',
    },
    companyInfo: {
      companyName: '',
      industry: '',
      companySize: 0,
      websiteUrl: '',
      nit: undefined,
      contactFirstName: firstName,
      contactLastName: lastName,
    },
    socialLinks: [],
    academicRecords: [],
    workExperiences: [],
  }
}

function getOrCreateStoredRecruiterProfile(): RecruiterProfile {
  const profileKey = getCurrentRecruiterStorageKey()
  const profiles = readStoredRecruiterProfiles()
  const existing = profiles[profileKey]
  if (existing) {
    return mapRecruiterProfile(existing)
  }

  const created = buildDefaultRecruiterProfile()
  profiles[profileKey] = created
  writeStoredRecruiterProfiles(profiles)
  return mapRecruiterProfile(created)
}

function saveStoredRecruiterProfile(profile: RecruiterProfile): void {
  const profileKey = getCurrentRecruiterStorageKey()
  const profiles = readStoredRecruiterProfiles()
  profiles[profileKey] = mapRecruiterProfile(profile)
  writeStoredRecruiterProfiles(profiles)
}

function getAuthTokenOrThrow(): string {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (!token) {
    throw new Error('Tu sesion expiro. Inicia sesion nuevamente.')
  }

  return token
}

function resolveErrorMessage(payload: BackendApiResponse<unknown> | null, fallback: string): string {
  if (payload?.errors?.length) {
    return payload.errors[0]
  }

  if (payload?.message) {
    return payload.message
  }

  return fallback
}

function mapRecruiterProfile(profile: RecruiterProfile): RecruiterProfile {
  return {
    userId: profile.userId,
    profileId: profile.profileId ?? profile.userId,
    email: profile.email ?? '',
    userType: profile.userType ?? 'RECLUTADOR',
    photoBase64: profile.photoBase64,
    basicInfo: {
      fullName: profile.basicInfo?.fullName ?? '',
      firstName: profile.basicInfo?.firstName ?? '',
      lastName: profile.basicInfo?.lastName ?? '',
      professionalTitle: profile.basicInfo?.professionalTitle ?? '',
      countryId: profile.basicInfo?.countryId ?? '',
    },
    companyInfo: {
      companyName: profile.companyInfo?.companyName ?? '',
      industry: profile.companyInfo?.industry ?? '',
      companySize: profile.companyInfo?.companySize ?? 0,
      websiteUrl: profile.companyInfo?.websiteUrl ?? '',
      nit: profile.companyInfo?.nit,
      contactFirstName: profile.companyInfo?.contactFirstName ?? '',
      contactLastName: profile.companyInfo?.contactLastName ?? '',
    },
    socialLinks: Array.isArray(profile.socialLinks) ? profile.socialLinks : [],
    academicRecords: Array.isArray(profile.academicRecords) ? profile.academicRecords : [],
    workExperiences: Array.isArray(profile.workExperiences) ? profile.workExperiences : [],
  }
}

export async function completeRecruiterProfile(payload: CompleteRecruiterProfilePayload): Promise<void> {
  const localProfile = getOrCreateStoredRecruiterProfile()
  const nextProfile: RecruiterProfile = {
    ...localProfile,
    basicInfo: {
      ...localProfile.basicInfo,
      firstName: payload.firstName,
      lastName: payload.lastName,
      fullName: `${payload.firstName} ${payload.lastName}`.trim(),
      professionalTitle: payload.professionalTitle,
      countryId: payload.countryId,
    },
    companyInfo: {
      ...localProfile.companyInfo,
      companyName: payload.companyName,
      industry: payload.industry,
      companySize: payload.companySize,
      websiteUrl: payload.websiteUrl,
      nit: payload.nit,
      contactFirstName: payload.contactFirstName,
      contactLastName: payload.contactLastName,
    },
    socialLinks: payload.socialLinks.map((item) => ({
      platformId: item.platformId,
      plataformId: item.platformId,
      url: item.url,
    })),
    academicRecords: Array.isArray(payload.academicRecords) ? payload.academicRecords : [],
    workExperiences: Array.isArray(payload.workExperiences) ? payload.workExperiences : [],
  }

  saveStoredRecruiterProfile(nextProfile)

  try {
    const token = getAuthTokenOrThrow()
    const response = await fetch(`${API_BASE_URL}/api/recruiter/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })

    const body = await response.json().catch(() => ({}))
    if (!response.ok || body?.success === false) {
      return
    }
  } catch {
    // In mock mode (sin backend), already persisted locally.
  }
}

export async function fetchRecruiterProfile(): Promise<RecruiterProfile> {
  try {
    const token = getAuthTokenOrThrow()

    const response = await fetch(`${API_BASE_URL}/api/recruiter/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const body = (await response.json().catch(() => null)) as BackendApiResponse<RecruiterProfile> | RecruiterProfile | null

    if (!response.ok) {
      throw new Error(resolveErrorMessage(body && 'data' in body ? body : null, 'No se pudo cargar el perfil de reclutador'))
    }

    if (body && typeof body === 'object' && 'data' in body && body.data) {
      const mapped = mapRecruiterProfile(body.data)
      saveStoredRecruiterProfile(mapped)
      return mapped
    }

    if (body && typeof body === 'object' && 'basicInfo' in body) {
      const mapped = mapRecruiterProfile(body as RecruiterProfile)
      saveStoredRecruiterProfile(mapped)
      return mapped
    }
  } catch {
    return getOrCreateStoredRecruiterProfile()
  }

  return getOrCreateStoredRecruiterProfile()
}

export async function fetchProfile(userId: string): Promise<Profile> {
  return {
    id: userId,
    name: 'Usuario',
  }
}

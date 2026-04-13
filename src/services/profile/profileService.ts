import type { Profile } from '../../types/profile.types'
import { AUTH_TOKEN_STORAGE_KEY } from '../../store/auth/authStore'

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

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
    const backendError = body?.errors?.[0] || body?.message
    throw new Error(backendError || 'No se pudo guardar el perfil de reclutador')
  }
}

export async function fetchRecruiterProfile(): Promise<RecruiterProfile> {
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
    return mapRecruiterProfile(body.data)
  }

  if (body && typeof body === 'object' && 'basicInfo' in body) {
    return mapRecruiterProfile(body as RecruiterProfile)
  }

  throw new Error('La respuesta del servidor no tiene el formato esperado')
}

export async function fetchProfile(userId: string): Promise<Profile> {
  return {
    id: userId,
    name: 'Usuario',
  }
}

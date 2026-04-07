import type { Profile } from '../../types/profile.types'
import { AUTH_TOKEN_STORAGE_KEY } from '../../store/auth/authStore'

const API_BASE_URL = String(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

export type CompleteRecruiterProfilePayload = {
  companyName: string
  industry: string
  companySize: number
  websiteUrl?: string
  hiringNeeds: string
}

export async function completeRecruiterProfile(payload: CompleteRecruiterProfilePayload): Promise<void> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  if (!token) {
    throw new Error('Tu sesion expiro. Inicia sesion nuevamente.')
  }

  const response = await fetch(`${API_BASE_URL}/api/recruiter/profile/complete`, {
    method: 'POST',
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

export async function fetchProfile(userId: string): Promise<Profile> {
  return {
    id: userId,
    name: 'Usuario',
  }
}